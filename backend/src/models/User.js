import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    targetRole: {
      type: String,
      default: "AI/ML Engineer",
    },

    skills: {
      type: [String],
      default: [],
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;