// backend/routes/properties.js
import express from "express";
import Property from "../models/Property.js";
import Room from "../models/Room.js"; // Import Room
import auth from "../middleware/auth.js";


const router = express.Router();

/**
 * POST /api/properties
 * Create new property (landlord only)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, address, city, rent, bedrooms, bathrooms, images, amenities, coverImage } = req.body;

    if (!title || !address || !city || !rent) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const ownerId = req.user.id;

    const property = await Property.create({
      title, address, city, rent, bedrooms, bathrooms, images, amenities, coverImage,
      owner: ownerId,
    });

    await property.populate("owner", "name email");
    res.status(201).json(property);
  } catch (err) {
    console.error("Create property error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const { title, address, city, rent, bedrooms, bathrooms, images, amenities, coverImage } = req.body;

    // Update fields if provided
    if (title) property.title = title;
    if (address) property.address = address;
    if (city) property.city = city;
    if (rent) property.rent = rent;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (images) property.images = images;
    if (amenities) property.amenities = amenities;
    if (coverImage) property.coverImage = coverImage;

    await property.save();
    res.json(property);
  } catch (err) {
    console.error("Update property error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET /api/properties
 * Public list of all properties
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.owner) filter.owner = req.query.owner;

    const properties = await Property.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    console.error("List properties error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET /api/properties/:id
 * Single property details
 */
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!property) return res.status(404).json({ msg: "Property not found" });

    res.json(property);
  } catch (err) {
    console.error("Get property error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * DELETE /api/properties/:id
 * Delete property (Owner only)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    // Verify ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete associated rooms first
    await Room.deleteMany({ property: req.params.id });

    await property.deleteOne();
    res.json({ msg: "Property and associated rooms deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;