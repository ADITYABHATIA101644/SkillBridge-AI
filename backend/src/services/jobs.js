import Job from "../models/Job.js";


/* =========================================================
   GET JOBS
   ========================================================= */

export async function getJobs(filters = {}) {
  const {
    search,
    role,
    location,
    limit = 50,
  } = filters;

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

  return Job.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();
}


/* =========================================================
   GET SINGLE JOB
   ========================================================= */

export async function getJobById(id) {
  return Job.findById(id).lean();
}


/* =========================================================
   CREATE JOB
   ========================================================= */

export async function createJob(data) {
  const job = new Job(data);

  return job.save();
}


/* =========================================================
   UPDATE JOB
   ========================================================= */

export async function updateJob(id, data) {
  return Job.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
}


/* =========================================================
   DELETE JOB
   ========================================================= */

export async function deleteJob(id) {
  return Job.findByIdAndDelete(id);
}


/* =========================================================
   TRENDING SKILLS
   ========================================================= */

export async function getTrendingSkills() {
  const jobs = await Job.find({}).lean();

  const skillCount = {};

  for (const job of jobs) {
    let skills = [];

    if (Array.isArray(job.skills)) {
      skills.push(...job.skills);
    }

    if (Array.isArray(job.requiredSkills)) {
      skills.push(...job.requiredSkills);
    }

    if (typeof job.skills === "string") {
      skills.push(
        ...job.skills.split(",")
      );
    }

    for (const skill of skills) {
      if (!skill) continue;

      const normalized =
        String(skill)
          .trim()
          .toLowerCase();

      if (!normalized) continue;

      skillCount[normalized] =
        (skillCount[normalized] || 0) + 1;
    }
  }

  return Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([skill, count]) => ({
      skill,
      count,
    }));
}


/* =========================================================
   SYNC JOBS
   =========================================================
   Kept because server.js imports:
   
   import { syncJobs } from "./services/jobs.js";
   ========================================================= */

export async function syncJobs(jobs = []) {
  if (!Array.isArray(jobs)) {
    throw new Error(
      "syncJobs expects an array of jobs"
    );
  }

  if (jobs.length === 0) {
    return {
      success: true,
      count: 0,
      message: "No jobs to synchronize",
    };
  }

  let inserted = 0;
  let updated = 0;

  for (const jobData of jobs) {
    try {
      const externalId =
        jobData.externalId ||
        jobData.id ||
        jobData.jobId;

      if (externalId) {
        const existingJob =
          await Job.findOne({
            externalId: String(externalId),
          });

        if (existingJob) {
          await Job.findByIdAndUpdate(
            existingJob._id,
            {
              ...jobData,
              externalId:
                String(externalId),
            },
            {
              new: true,
              runValidators: true,
            }
          );

          updated++;
          continue;
        }
      }

      await Job.create({
        ...jobData,
        externalId: externalId
          ? String(externalId)
          : "",
      });

      inserted++;
    } catch (error) {
      console.error(
        "Error syncing job:",
        error.message
      );
    }
  }

  return {
    success: true,
    inserted,
    updated,
    count: inserted + updated,
  };
}