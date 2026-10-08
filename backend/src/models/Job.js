import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    salary: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    employmentType: {
      type: String,
      default: "Full-time",
    },

    source: {
      type: String,
      default: "SkillBridge",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    externalId: {
      type: String,
      default: "",
    },

    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Job =
  mongoose.models.Job ||
  mongoose.model("Job", jobSchema);

export default Job;