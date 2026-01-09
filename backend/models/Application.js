import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        tenant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Cancelled"],
            default: "Pending"
        },
        cancellationReason: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
