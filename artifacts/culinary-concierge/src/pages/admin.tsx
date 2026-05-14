import { Router } from "express";
import { connectDB, UserModel } from "../lib/mongodb";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  await connectDB();
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, password majburiy" });
  }
  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" });
  }
  const id = Math.random().toString(36).substring(2);
  const newUser = new UserModel({
    _id: id,
    name,
    email,
    password,
    phone: phone || "",
    address: "",
    joinDate: new Date().toISOString().split("T")[0],
    bonusPoints: 0,
    role: "customer",
  });
  await newUser.save();
  const { password: _p, ...userData } = newUser.toObject();
  res.status(201).json({ ...userData, id: userData._id });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  await connectDB();
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email va password majburiy" });
  }
  const user = await UserModel.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: "Email yoki parol noto'g'ri" });
  }
  const { password: _p, ...userData } = user.toObject();
  res.json({ ...userData, id: userData._id });
});

// PATCH /api/auth/users/:id
router.patch("/users/:id", async (req, res) => {
  await connectDB();
  const { id } = req.params;
  const { password: _p, role: _r, ...updates } = req.body;
  const user = await UserModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
  if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
  const { password: _pw, ...userData } = user.toObject();
  res.json({ ...userData, id: userData._id });
});

// GET /api/auth/users/:id
router.get("/users/:id", async (req, res) => {
  await connectDB();
  const user = await UserModel.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "Topilmadi" });
  const { password: _p, ...userData } = user.toObject();
  res.json({ ...userData, id: userData._id });
});

// GET /api/auth/users/count
router.get("/users/count", async (_req, res) => {
  await connectDB();
  const count = await UserModel.countDocuments();
  res.json({ count });
});

export default router;