import { Router } from "express";
import { connectDB, TableOrderModel } from "../lib/mongodb";

const router = Router();

// GET /api/orders  (barcha orderlar — admin uchun)
router.get("/", async (_req, res) => {
  await connectDB();
  const orders = await TableOrderModel.find({});
  res.json(orders.map(toClient));
});

// GET /api/orders/user/:userId  (foydalanuvchi orderlari)
router.get("/user/:userId", async (req, res) => {
  await connectDB();
  const orders = await TableOrderModel.find({ userId: req.params.userId });
  res.json(orders.map(toClient));
});

// POST /api/orders  (yangi order yaratish)
router.post("/", async (req, res) => {
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
  res.status(201).json(toClient(order));
});

// PATCH /api/orders/:id  (orderni yangilash: items, tableStatus va h.k.)
router.patch("/:id", async (req, res) => {
  await connectDB();
  const order = await TableOrderModel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: "Order topilmadi" });
  res.json(toClient(order));
});

// PATCH /api/orders/:id/items/:itemId  (bitta item statusini yangilash)
router.patch("/:id/items/:itemId", async (req, res) => {
  await connectDB();
  const { status } = req.body;
  const order = await TableOrderModel.findOneAndUpdate(
    { _id: req.params.id, "items.id": req.params.itemId },
    { $set: { "items.$.status": status } },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: "Order yoki item topilmadi" });
  res.json(toClient(order));
});

// DELETE /api/orders/:id/items/:itemId  (itemni o'chirish)
router.delete("/:id/items/:itemId", async (req, res) => {
  await connectDB();
  const order = await TableOrderModel.findByIdAndUpdate(
    req.params.id,
    { $pull: { items: { id: req.params.itemId } } },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: "Order topilmadi" });
  // totalini qayta hisoblaymiz
  const total = order.items.reduce((s: number, i: any) => s + i.price, 0);
  await TableOrderModel.findByIdAndUpdate(req.params.id, { $set: { total } });
  order.total = total;
  res.json(toClient(order));
});

function toClient(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  const { _id, ...rest } = obj;
  return { ...rest, id: _id };
}

export default router;
