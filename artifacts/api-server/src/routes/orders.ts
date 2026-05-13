import { Router, Request, Response } from "express";
import { connectDB, TableOrderModel } from "../lib/mongodb";

const router = Router();

// GET /api/orders (barcha orderlar — admin uchun)
router.get("/", async (_req: Request, res: Response): Promise<any> => {
  try {
    await connectDB();
    const orders = await TableOrderModel.find({});
    return res.json(orders.map(toClient));
  } catch (error) {
    return res.status(500).json({ error: "Server xatosi" });
  }
});

// GET /api/orders/user/:userId (foydalanuvchi orderlari)
router.get("/user/:userId", async (req: Request, res: Response): Promise<any> => {
  try {
    await connectDB();
    const orders = await TableOrderModel.find({ userId: req.params.userId });
    return res.json(orders.map(toClient));
  } catch (error) {
    return res.status(500).json({ error: "Ma'lumot olishda xato" });
  }
});

// POST /api/orders (yangi order yaratish)
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    await connectDB();
    const data = req.body;
    if (!data.id || !data.tableId || !data.userId) {
      return res.status(400).json({ error: "id, tableId, userId majburiy" });
    }
    // Eski aktiv orderni bekor qilamiz
    await TableOrderModel.updateMany(
      { tableId: data.tableId, tableStatus: { $ne: "bosh" } },
      { $set: { tableStatus: "bosh" } }
    );
    const order = new TableOrderModel({ _id: data.id, ...data });
    await order.save();
    return res.status(201).json(toClient(order));
  } catch (error) {
    return res.status(500).json({ error: "Order yaratishda xato" });
  }
});

// PATCH /api/orders/:id (orderni yangilash)
router.patch("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    await connectDB();
    const order = await TableOrderModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order topilmadi" });
    return res.json(toClient(order));
  } catch (error) {
    return res.status(500).json({ error: "Yangilashda xato" });
  }
});

// PATCH /api/orders/:id/items/:itemId (bitta item statusini yangilash)
router.patch("/:id/items/:itemId", async (req: Request, res: Response): Promise<any> => {
  try {
    await connectDB();
    const { status } = req.body;
    const order = await TableOrderModel.findOneAndUpdate(
      { _id: req.params.id, "items.id": req.params.itemId },
      { $set: { "items.$.status": status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order yoki item topilmadi" });
    return res.json(toClient(order));
  } catch (error) {
    return res.status(500).json({ error: "Item statusini yangilashda xato" });
  }
});

// DELETE /api/orders/:id/items/:itemId (itemni o'chirish)
router.delete("/:id/items/:itemId", async (req: Request, res: Response): Promise<any> => {
  try {
    await connectDB();
    const order = await TableOrderModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { items: { id: req.params.itemId } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order topilmadi" });
    
    // totalini qayta hisoblaymiz
    const total = order.items.reduce((s: number, i: any) => s + i.price, 0);
    const updatedOrder = await TableOrderModel.findByIdAndUpdate(
      req.params.id, 
      { $set: { total } }, 
      { new: true }
    );
    
    return res.json(toClient(updatedOrder));
  } catch (error) {
    return res.status(500).json({ error: "O'chirishda xato" });
  }
});

function toClient(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  const { _id, ...rest } = obj;
  return { ...rest, id: _id };
}

export default router;