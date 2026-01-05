import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true
        },
        roomNumber: {
            type: String,
            required: true,
            trim: true
        },
        rent: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Vacant", "Occupied", "Maintenance"],
            default: "Vacant"
        },
        currentTenant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
