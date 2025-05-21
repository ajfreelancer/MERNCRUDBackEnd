import dotenv from "dotenv";
dotenv.config();
// Core modules
import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js"; // make sure file ends in .js
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";

import cors from "cors";

// Add this BEFORE your routes

const app = express();

app.use(cors());

// Connect to DB
connectDB();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Your routes and middleware...
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Middleware to parse JSON
app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
