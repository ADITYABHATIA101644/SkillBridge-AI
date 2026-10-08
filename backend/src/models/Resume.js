import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    targetRole: {
      type: String,
      default: "AI/ML Engineer",
    },

    rawText: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    skillGaps: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Resume =
  mongoose.models.Resume ||
  mongoose.model("Resume", resumeSchema);

export default Resume;