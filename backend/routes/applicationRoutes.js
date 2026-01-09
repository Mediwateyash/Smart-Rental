import express from "express";
import Application from "../models/Application.js";
import Room from "../models/Room.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Apply for a room (Tenant only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("Application received for room:", req.body.roomId, "from user:", req.user.id);
        const { roomId } = req.body;
        // Check if already applied or occupied
        const existing = await Application.findOne({ tenant: req.user.id, room: roomId });
        if (existing) return res.status(400).json({ msg: "Already applied" });

        const app = await Application.create({
            tenant: req.user.id,
            room: roomId,
            status: "Pending"
        });
        res.status(201).json(app);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get my applications (Tenant)
router.get("/my-applications", authMiddleware, async (req, res) => {
    try {
        const apps = await Application.find({ tenant: req.user.id })
            .populate({
                path: "room",
                populate: { path: "property" }
            });
        res.json(apps);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get all applications (Admin/Owner)
router.get("/", authMiddleware, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'owner') {
            // Find rooms owned by this user
            // This is a bit complex in Mongo without aggregation, 
            // but simpler: find properties owned by user -> find rooms in those properties -> find apps for those rooms
            // Or populate and filter in JS (inefficient but works for small app)
            const apps = await Application.find()
                .populate("tenant", "name email phone monthlyIncome occupation")
                .populate({
                    path: "room",
                    populate: { path: "property" }
                });

            const myApps = apps.filter(app => {
                if (!app.room || !app.room.property) return false;
                const ownerId = app.room.property.owner;
                // Handle if owner is populated object or just ID
                const oid = ownerId._id || ownerId;
                return oid.toString() === req.user.id;
            });
            return res.json(myApps);
        }

        if (req.user.role === 'admin') {
            const apps = await Application.find()
                .populate("tenant", "name email phone monthlyIncome occupation")
                .populate({
                    path: "room",
                    populate: { path: "property" }
                });
            return res.json(apps);
        }

        if (req.user.role === 'tenant') {
            const apps = await Application.find({ tenant: req.user.id })
                .populate("tenant", "name email phone monthlyIncome occupation")
                .populate({
                    path: "room",
                    populate: { path: "property" }
                });
            return res.json(apps);
        }

        return res.status(403).json({ msg: "Access denied" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Approve/Reject (Admin/Owner)
router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body; // Approved, Rejected
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ msg: "Application not found" });

        app.status = status;
        await app.save();

        if (status === "Approved") {
            // Mark room as Occupied and assign tenant
            const room = await Room.findById(app.room);
            if (room) {
                room.status = "Occupied";
                room.currentTenant = app.tenant;
                await room.save();
            }

            // Reject other pending apps for this room? (Optional logic)
        }

        res.json(app);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Cancel Application (Tenant only)
router.put("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const { reason } = req.body;
        const app = await Application.findById(req.params.id);

        if (!app) return res.status(404).json({ msg: "Application not found" });
        if (app.tenant.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

        // If previously approved, free up the room
        if (app.status === "Approved") {
            const room = await Room.findById(app.room);
            if (room) {
                room.status = "Vacant";
                room.currentTenant = null;
                await room.save();
            }
        }

        app.status = "Cancelled";
        app.cancellationReason = reason || "No reason provided";
        await app.save();

        res.json(app);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
