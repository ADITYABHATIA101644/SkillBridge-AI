import mongoose from "mongoose";

const assessmentAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    selectedAnswer: {
      type: Number,
      default: -1,
    },

    correct: {
      type: Boolean,
      default: false,
    },

    skill: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      default: "Medium",
    },
  },
  {
    _id: false,
  }
);

const skillScoreSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },

    correct: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    correctAnswers: {
      type: Number,
      required: true,
    },

    skillScores: {
      type: [skillScoreSchema],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    gaps: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    answers: {
      type: [assessmentAnswerSchema],
      default: [],
    },

    durationSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Assessment =
  mongoose.models.Assessment ||
  mongoose.model(
    "Assessment",
    assessmentSchema
  );

export default Assessment;