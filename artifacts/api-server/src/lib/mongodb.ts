import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    logger.info("MongoDB ga ulandi");
  } catch (err) {
    logger.error({ err }, "MongoDB ulanishda xatolik");
    throw err;
  }
}

const userSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: { type: String, default: "" },
  joinDate: { type: String, required: true },
  bonusPoints: { type: Number, default: 0 },
  role: { type: String, enum: ["admin", "waiter", "customer"], default: "customer" },
}, { _id: false });

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

const orderItemSchema = new mongoose.Schema({
  id: String,
  foodId: Number,
  name: String,
  price: Number,
  status: { type: String, enum: ["kutilmoqda", "tayor", "bekor"], default: "kutilmoqda" },
}, { _id: false });

const tableOrderSchema = new mongoose.Schema({
  _id: String,
  tableId: String,
  tableLabel: String,
  zone: String,
  userId: String,
  userEmail: String,
  date: String,
  reservationDate: String,
  reservationTime: String,
  guests: Number,
  items: [orderItemSchema],
  tableStatus: { type: String, enum: ["band", "ovqatlanmoqda", "tayor", "bosh"], default: "band" },
  total: { type: Number, default: 0 },
}, { _id: false });

export const TableOrderModel = mongoose.models.TableOrder || mongoose.model("TableOrder", tableOrderSchema);