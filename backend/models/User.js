import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["owner", "tenant", "admin"],
      default: "tenant"
    },
    // Enhanced Profile Fields
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    occupation: { type: String, default: "" },
    monthlyIncome: { type: Number, default: 0 }, // Record keeping only
    profilePhoto: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);