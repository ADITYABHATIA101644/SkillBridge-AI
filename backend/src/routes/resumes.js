import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import Resume from "../models/Resume.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* ============================================
   MULTER
============================================ */

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, DOC and DOCX files are allowed.")
      );
    }

    cb(null, true);
  },
});

/* ============================================
   ROLE SKILLS
============================================ */

const ROLE_SKILLS = {
  "AI/ML Engineer": [
    "python",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "numpy",
    "pandas",
    "sql",
    "docker",
    "git",
    "nlp",
    "computer vision",
    "statistics",
    "data structures",
    "algorithms",
  ],

  "Data Scientist": [
    "python",
    "machine learning",
    "statistics",
    "pandas",
    "numpy",
    "scikit-learn",
    "sql",
    "data visualization",
    "matplotlib",
    "seaborn",
    "power bi",
    "tableau",
    "deep learning",
  ],

  "Software Engineer": [
    "java",
    "python",
    "c++",
    "javascript",
    "data structures",
    "algorithms",
    "sql",
    "git",
    "rest api",
    "database",
    "oop",
    "system design",
  ],

  "Full Stack Developer": [
    "html",
    "css",
    "javascript",
    "react",
    "node.js",
    "express",
    "mongodb",
    "sql",
    "rest api",
    "git",
    "typescript",
  ],
};

/* ============================================
   SKILL EXTRACTION
============================================ */

function extractSkills(text) {
  const normalizedText = text.toLowerCase();

  const allSkills = [
    ...new Set(
      Object.values(ROLE_SKILLS).flat()
    ),
  ];

  return allSkills.filter((skill) =>
    normalizedText.includes(skill.toLowerCase())
  );
}

/* ============================================
   RESUME ANALYSIS
============================================ */

function analyzeResume(text, targetRole) {
  const skills = extractSkills(text);

  const roleSkills =
    ROLE_SKILLS[targetRole] ||
    ROLE_SKILLS["AI/ML Engineer"];

  const matchedSkills = roleSkills.filter((skill) =>
    skills.some(
      (userSkill) =>
        userSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  const skillGaps = roleSkills.filter(
    (skill) =>
      !skills.some(
        (userSkill) =>
          userSkill.toLowerCase() === skill.toLowerCase()
      )
  );

  const score =
    roleSkills.length > 0
      ? Math.round(
          (matchedSkills.length / roleSkills.length) * 100
        )
      : 0;

  const strengths = matchedSkills.slice(0, 8);

  const suggestions = skillGaps
    .slice(0, 8)
    .map(
      (skill) =>
        `Consider improving your ${skill} skills for the ${targetRole} role.`
    );

  return {
    skills,
    strengths,
    skillGaps,
    suggestions,
    score,
    matchPercentage: score,
    matchedSkills,
  };
}

/* ============================================
   FILE TEXT EXTRACTION
============================================ */

async function extractTextFromFile(file) {
  if (!file) {
    return "";
  }

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();

      return result.text || "";
    } finally {
      await parser.destroy();
    }
  }

  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value || "";
  }

  return "";
}

/* ============================================
   GET ALL USER RESUMES
   GET /api/resumes
============================================ */

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.json({
          success: true,
          resumes: [],
        });
      }

      const resumes = await Resume.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        resumes,
      });
    } catch (error) {
      console.error("Get resumes error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to retrieve resumes.",
      });
    }
  }
);

/* ============================================
   UPLOAD + ANALYZE RESUME
   POST /api/resumes/upload
============================================ */

router.post(
  "/upload",
  authenticateToken,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        const targetRole = req.body.targetRole || "AI/ML Engineer";
        const rawText = await extractTextFromFile(req.file);
        const analysis = analyzeResume(rawText || "", targetRole);

        return res.status(200).json({
          success: true,
          message: "Resume analyzed successfully.",
          resume: {
            _id: new mongoose.Types.ObjectId().toString(),
            userId: req.user.id,
            fileName: req.file?.originalname || "demo-resume.pdf",
            fileType: req.file?.mimetype || "application/pdf",
            targetRole,
            rawText: rawText || "",
            skills: analysis.skills,
            strengths: analysis.strengths,
            skillGaps: analysis.skillGaps,
            suggestions: analysis.suggestions,
            score: analysis.score,
            matchPercentage: analysis.matchPercentage,
            matchedSkills: analysis.matchedSkills,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume file.",
        });
      }

      const targetRole =
        req.body.targetRole ||
        "AI/ML Engineer";

      const rawText =
        await extractTextFromFile(req.file);

      if (!rawText.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Unable to extract text from the uploaded resume.",
        });
      }

      const analysis = analyzeResume(
        rawText,
        targetRole
      );

      const resume = await Resume.create({
        userId: req.user.id,

        fileName: req.file.originalname,

        fileType: req.file.mimetype,

        targetRole,

        rawText,

        skills: analysis.skills,

        strengths: analysis.strengths,

        skillGaps: analysis.skillGaps,

        suggestions: analysis.suggestions,

        score: analysis.score,

        analysis,
      });

      return res.status(201).json({
        success: true,

        message: "Resume analyzed successfully.",

        resume: {
          ...resume.toObject(),

          matchPercentage:
            analysis.matchPercentage,

          matchedSkills:
            analysis.matchedSkills,
        },
      });
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to analyze resume.",
      });
    }
  }
);

/* ============================================
   GET SINGLE RESUME
   GET /api/resumes/:id
============================================ */

router.get(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume ID.",
        });
      }

      const resume = await Resume.findOne({
        _id: id,
        userId: req.user.id,
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }

      return res.json({
        success: true,
        resume,
      });
    } catch (error) {
      console.error(
        "Get resume error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to retrieve resume.",
      });
    }
  }
);

/* ============================================
   UPDATE RESUME
   PUT /api/resumes/:id
============================================ */

router.put(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume ID.",
        });
      }

      const allowedFields = [
        "targetRole",
        "skills",
        "strengths",
        "skillGaps",
        "suggestions",
        "score",
        "analysis",
      ];

      const updates = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const resume =
        await Resume.findOneAndUpdate(
          {
            _id: id,
            userId: req.user.id,
          },
          updates,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }

      return res.json({
        success: true,
        message: "Resume updated successfully.",
        resume,
      });
    } catch (error) {
      console.error(
        "Update resume error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to update resume.",
      });
    }
  }
);

/* ============================================
   DELETE RESUME
   DELETE /api/resumes/:id
============================================ */

router.delete(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume ID.",
        });
      }

      const resume =
        await Resume.findOneAndDelete({
          _id: id,
          userId: req.user.id,
        });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }

      return res.json({
        success: true,
        message: "Resume deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to delete resume.",
      });
    }
  }
);

/* ============================================
   MULTER ERROR HANDLER
============================================ */

router.use(
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message:
            "Resume file must be smaller than 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  }
);

export default router;