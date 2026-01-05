// backend/server.js - force restart
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import roomRoutes from "./routes/roomRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Middleware
import auth from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, { dbName: "smart_rental_db" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// --- Health route ---
app.get("/", (req, res) => res.json({ ok: true, message: "API running..." }));

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

// --- Example protected route ---
app.get("/api/protected", auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);