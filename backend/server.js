import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ These lines replicate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Firebase setup (replace your old block with this)
const serviceAccountPath = path.resolve(__dirname, process.env.FIREBASE_CREDENTIALS);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
