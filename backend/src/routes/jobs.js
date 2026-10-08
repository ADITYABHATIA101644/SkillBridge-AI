import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";

const router = express.Router();

/* =========================================================
   GET ALL JOBS
   GET /api/jobs
   ========================================================= */

router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        jobs: [],
      });
    }

    const {
      search,
      role,
      location,
      limit = 50,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      query.title = {
        $regex: role,
        $options: "i",
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch jobs",
      jobs: [],
    });
  }
});


/* =========================================================
   TRENDING SKILLS
   GET /api/jobs/trending-skills
   ========================================================= */

router.get("/trending-skills", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        skills: [],
      });
    }

    const jobs = await Job.find({}).lean();

    const skillCount = {};

    for (const job of jobs) {
      let skills = [];

      if (Array.isArray(job.skills)) {
        skills.push(...job.skills);
      }

      if (typeof job.skills === "string") {
        skills.push(
          ...job.skills
            .split(",")
            .map((skill) => skill.trim())
        );
      }

      if (Array.isArray(job.requiredSkills)) {
        skills.push(...job.requiredSkills);
      }

      for (const skill of skills) {
        if (!skill) continue;

        const normalizedSkill = String(skill)
          .trim()
          .toLowerCase();

        if (!normalizedSkill) continue;

        skillCount[normalizedSkill] =
          (skillCount[normalizedSkill] || 0) + 1;
      }
    }

    const trendingSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([skill, count]) => ({
        skill,
        count,
      }));

    res.status(200).json({
      success: true,
      skills: trendingSkills,
    });
  } catch (error) {
    console.error("TRENDING SKILLS ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to calculate trending skills",
      skills: [],
    });
  }
});


/* =========================================================
   GET SINGLE JOB
   GET /api/jobs/:id
   ========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid job ID",
      });
    }

    const job = await Job.findById(id).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch job",
    });
  }
});


/* =========================================================
   CREATE JOB
   POST /api/jobs
   ========================================================= */

router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);

    const savedJob = await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});


/* =========================================================
   UPDATE JOB
   PUT /api/jobs/:id
   ========================================================= */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid job ID",
      });
    }

    const updatedJob =
      await Job.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});


/* =========================================================
   DELETE JOB
   DELETE /api/jobs/:id
   ========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid job ID",
      });
    }

    const deletedJob =
      await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to delete job",
    });
  }
});


export default router;