import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address, occupation, monthlyIncome } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ msg: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash, role,
      phone, address, occupation, monthlyIncome
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: {
        id: user._id, name, email, role: user.role,
        phone, address, occupation, monthlyIncome
      }
    });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
});

export default router;