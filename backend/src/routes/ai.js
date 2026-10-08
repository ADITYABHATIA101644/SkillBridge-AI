import express from "express";

const router =
  express.Router();

// =====================================================
// RESUME AI REVIEW
// =====================================================

router.post(
  "/resume",
  async (req, res) => {
    try {
      const {
        resume,
        targetRole,
        jobDescription,
        skills,
      } = req.body || {};

      const resumeText =
        typeof resume === "string"
          ? resume
          : JSON.stringify(
              resume || {}
            );

      const detectedSkills =
        Array.isArray(skills)
          ? skills
          : [];

      const role =
        targetRole ||
        "AI/ML Engineer";

      const suggestions = [];

      if (
        resumeText.length < 100
      ) {
        suggestions.push(
          "Add more detailed project and experience information."
        );
      }

      if (
        detectedSkills.length === 0
      ) {
        suggestions.push(
          "Add a dedicated technical skills section."
        );
      }

      if (
        !/github/i.test(
          resumeText
        )
      ) {
        suggestions.push(
          "Add GitHub links for relevant technical projects."
        );
      }

      suggestions.push(
        "Use measurable outcomes in project descriptions.",
        `Align your resume with the ${role} role.`,
        "Keep every claim evidence-backed and accurate."
      );

      let score = 55;

      if (
        detectedSkills.length >= 5
      ) {
        score += 15;
      }

      if (
        detectedSkills.length >= 10
      ) {
        score += 10;
      }

      if (
        resumeText.length > 1000
      ) {
        score += 10;
      }

      score = Math.min(
        score,
        95
      );

      res.json({
        success: true,

        analysis: {
          targetRole: role,

          score,

          detectedSkills,

          suggestions,

          strengths: [
            "Technical project experience",
            "AI/ML specialization",
            "Potential for role-specific optimization",
          ],

          skillGaps: [],

          warning:
            "SkillBridge AI does not invent experience or qualifications.",
        },

        metadata: {
          jobDescription:
            jobDescription || "",
        },
      });
    } catch (error) {
      console.error(
        "AI resume error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Unable to analyze resume.",
      });
    }
  }
);

// =====================================================
// CAREER COPILOT
// =====================================================

router.post(
  "/chat",
  async (req, res) => {
    try {
      const {
        message,
        context = {},
      } = req.body || {};

      if (
        !message ||
        !String(message).trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Message is required.",
        });
      }

      const text =
        String(message).trim();

      const lower =
        text.toLowerCase();

      let reply =
        "I can help you with career planning, skill gaps, resumes, projects, DSA, SQL and learning roadmaps.";

      if (
        lower.includes(
          "ml engineer"
        ) ||
        lower.includes(
          "machine learning"
        )
      ) {
        reply =
          "For an ML Engineer path, prioritize Python, DSA, SQL, statistics, machine learning fundamentals, scikit-learn, deep learning, APIs, Git and deployment. Build 2–3 strong end-to-end projects and practice DSA consistently.";
      } else if (
        lower.includes(
          "data scientist"
        )
      ) {
        reply =
          "For Data Science, prioritize Python, SQL, statistics, probability, Pandas, NumPy, exploratory data analysis, machine learning and visualization. Build projects using real datasets and explain your findings clearly.";
      } else if (
        lower.includes(
          "full stack"
        )
      ) {
        reply =
          "For Full Stack Development, focus on HTML, CSS, JavaScript, React, Node.js, Express, databases, REST APIs, Git and deployment. Build complete applications rather than isolated frontend projects.";
      } else if (
        lower.includes(
          "roadmap"
        )
      ) {
        reply =
          "A practical roadmap is: strengthen Python and SQL → master DSA → learn statistics and ML → build end-to-end projects → learn APIs and deployment → improve your resume → practice interviews → apply to role-specific opportunities.";
      } else if (
        lower.includes(
          "resume"
        )
      ) {
        reply =
          "Tailor your resume to the target role, put strong projects and measurable outcomes first, highlight relevant technical skills, and remove unsupported claims. A good resume should provide evidence rather than simply listing technologies.";
      } else if (
        lower.includes("dsa")
      ) {
        reply =
          "For DSA, follow this order: arrays and strings → hashing → two pointers and sliding window → linked lists → stacks and queues → binary search → trees → heaps → graphs → recursion and backtracking → dynamic programming. Practice problems consistently instead of only watching lectures.";
      } else if (
        lower.includes("sql")
      ) {
        reply =
          "For placements, master SELECT, WHERE, GROUP BY, HAVING, ORDER BY, joins, subqueries, CTEs, aggregate functions, window functions, CASE statements, indexes and normalization. Practice writing queries from real datasets.";
      } else if (
        lower.includes(
          "project"
        )
      ) {
        reply =
          "Build projects that demonstrate a complete workflow: data/input → processing → intelligence → backend API → database → frontend → deployment. Your SkillBridge project itself can become a strong portfolio project if you document the architecture and measurable functionality.";
      } else if (
        lower.includes(
          "skill"
        )
      ) {
        const resumeSkills =
          context?.resumeSkills ||
          [];

        if (
          resumeSkills.length
        ) {
          reply =
            `Based on your current profile, SkillBridge has detected ${resumeSkills.length} skills. Focus next on skills that repeatedly appear in your target job descriptions and close the highest-impact gaps first.`;
        } else {
          reply =
            "Upload your resume first so SkillBridge can compare your current skills with your target role.";
        }
      }

      res.json({
        success: true,

        reply,

        message: reply,

        context,

        source:
          "SkillBridge Career Intelligence",
      });
    } catch (error) {
      console.error(
        "AI chat error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Unable to process AI request.",
      });
    }
  }
);

export default router;