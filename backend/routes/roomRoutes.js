import express from "express";
import Room from "../models/Room.js";
import Property from "../models/Property.js"; // Import Property
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all rooms (Publicly viewable for vacancy check, or filtered)
router.get("/", async (req, res) => {
    try {
        const { propertyId, owner } = req.query;
        const filter = {};
        if (propertyId) filter.property = propertyId;

        // If owner is specified, find properties owned by this user first
        if (owner) {
            const properties = await Property.find({ owner }).select('_id');
            const propertyIds = properties.map(p => p._id);
            filter.property = { $in: propertyIds };

            // If user has no properties, return empty array immediately
            if (propertyIds.length === 0) return res.json([]);
        }

        // Populate property (and its owner) AND currentTenant
        const rooms = await Room.find(filter)
            .populate({
                path: "property",
                populate: { path: "owner", select: "name phone email" }
            })
            .populate("currentTenant", "name email phone");
        res.json(rooms);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get Single Room
router.get("/:id", async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate({
            path: "property",
            populate: { path: "owner", select: "name phone email" }
        });
        if (!room) return res.status(404).json({ msg: "Room not found" });
        res.json(room);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add a room (Owner only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        // In a real app, verify req.user.role === 'owner' and they own the property
        const { propertyId, roomNumber, rent, bedrooms, bathrooms } = req.body;

        const room = await Room.create({
            property: propertyId,
            roomNumber,
            rent,
            status: "Vacant"
        });

        res.status(201).json(room);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete a room
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("property");
        if (!room) return res.status(404).json({ msg: "Room not found" });

        // If property is missing (orphaned room), allow admin to delete, or maybe just delete it? 
        // But for safety, if property exists, check owner. 
        if (room.property) {
            if (room.property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ msg: "Not authorized" });
            }
        } else {
            // If property doesn't exist, only admin or maybe the creator (if we tracked that) could delete. 
            // But usually this means data integrity issue. 
            // For now, let's allow it if the user IS an owner (of anything) or admin, 
            // essentially cleaning up garbage. Or maybe restrict to admin.
            // Let's assume the user trying to delete it thinks they own it.
            // If we can't verify, we should probably fail unless admin.
            if (req.user.role !== 'admin') {
                // Try to see if this user owns ANY property? No, that's too weak.
                // Let's just log it and maybe fail for now, OR return a specific error.
                // Actually, if the property is deleted, the room should be deleted too. 
                // If it wasn't, it's a zombie room. Let's allow deletion if the user is 'owner' role 
                // effectively allowing clean up, or restrict to admin.
                // Let's default to Admin only for orphaned rooms to be safe.
                return res.status(404).json({ msg: "Property for this room not found. Contact Admin." });
            }
        }

        await room.deleteOne();
        res.json({ msg: "Room deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
