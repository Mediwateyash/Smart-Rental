import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get My Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            occupation: user.occupation,
            monthlyIncome: user.monthlyIncome,
            profilePhoto: user.profilePhoto,
            description: user.description
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update My Profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, phone, address, occupation, monthlyIncome, profilePhoto, description } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (occupation) user.occupation = occupation;
        if (monthlyIncome) user.monthlyIncome = monthlyIncome;
        if (profilePhoto) user.profilePhoto = profilePhoto;
        if (description) user.description = description;

        await user.save();
        res.json({
            user: {
                id: user._id, name: user.name, email: user.email, role: user.role,
                phone: user.phone, address: user.address, occupation: user.occupation, monthlyIncome: user.monthlyIncome,
                profilePhoto: user.profilePhoto, description: user.description
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- ADMIN ROUTES ---

// Get All Users (Admin)
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Access denied" });
        const users = await User.find().select("-password");
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete User (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Access denied" });
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update User Role (Admin)
router.put("/:id/role", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Access denied" });
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.role = role;
        await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
