// =====================================================
// SkillBridge AI Service
// =====================================================

// =====================================================
// HELPER: NORMALIZE RESUME
// =====================================================

function normalizeResume(resume) {
  if (!resume) {
    return "";
  }

  if (typeof resume === "string") {
    return resume;
  }

  if (typeof resume === "object") {
    return JSON.stringify(resume);
  }

  return String(resume);
}

// =====================================================
// HELPER: NORMALIZE SKILLS
// =====================================================

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => String(skill).trim())
    .filter(Boolean);
}

// =====================================================
// RESUME REVIEW
// =====================================================

export async function reviewResume({
  resume,
  targetRole,
  jobDescription,
  skills,
}) {
  const resumeText = normalizeResume(resume);

  const detectedSkills =
    normalizeSkills(skills);

  const role =
    targetRole?.trim() ||
    "AI/ML Engineer";

  const suggestions = [];

  const strengths = [];

  const skillGaps = [];

  // ---------------------------------------------------
  // Resume length check
  // ---------------------------------------------------

  if (resumeText.length < 100) {
    suggestions.push(
      "Add more measurable project and experience details."
    );
  } else {
    strengths.push(
      "Resume contains sufficient textual information for analysis."
    );
  }

  // ---------------------------------------------------
  // Skills check
  // ---------------------------------------------------

  if (detectedSkills.length === 0) {
    suggestions.push(
      "Add a dedicated technical skills section."
    );
  } else {
    strengths.push(
      `Detected ${detectedSkills.length} technical skills.`
    );
  }

  // ---------------------------------------------------
  // General resume recommendations
  // ---------------------------------------------------

  suggestions.push(
    "Use measurable outcomes in project descriptions.",
    "Align relevant skills with the target role.",
    "Keep the resume focused on evidence-backed experience.",
    "Use strong action verbs when describing projects and achievements."
  );

  // ---------------------------------------------------
  // Role-specific skill analysis
  // ---------------------------------------------------

  const roleLower =
    role.toLowerCase();

  const roleSkills = getRoleSkills(roleLower);

  const normalizedDetected =
    detectedSkills.map((skill) =>
      skill.toLowerCase()
    );

  for (const requiredSkill of roleSkills) {
    const exists =
      normalizedDetected.some(
        (skill) =>
          skill.includes(
            requiredSkill.toLowerCase()
          ) ||
          requiredSkill
            .toLowerCase()
            .includes(skill)
      );

    if (!exists) {
      skillGaps.push(requiredSkill);
    }
  }

  // ---------------------------------------------------
  // Score
  // ---------------------------------------------------

  let score = 50;

  if (resumeText.length >= 100) {
    score += 10;
  }

  if (detectedSkills.length > 0) {
    score += Math.min(
      20,
      detectedSkills.length * 3
    );
  }

  if (skillGaps.length === 0) {
    score += 10;
  }

  score = Math.min(95, score);

  // ---------------------------------------------------
  // Return analysis
  // ---------------------------------------------------

  return {
    targetRole: role,

    score,

    detectedSkills,

    suggestions,

    strengths,

    skillGaps,

    warning:
      "SkillBridge AI does not invent experience or qualifications.",

    roleRecommendations: {
      requiredSkills: roleSkills,
      missingSkills: skillGaps,
    },

    metadata: {
      resumeLength: resumeText.length,
      jobDescriptionProvided:
        Boolean(jobDescription),
    },
  };
}

// =====================================================
// ROLE SKILL DATABASE
// =====================================================

function getRoleSkills(role) {
  if (
    role.includes("machine learning") ||
    role.includes("ml engineer")
  ) {
    return [
      "Python",
      "SQL",
      "DSA",
      "Statistics",
      "Machine Learning",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Git",
      "APIs",
      "Deployment",
    ];
  }

  if (
    role.includes("data scientist") ||
    role.includes("data science")
  ) {
    return [
      "Python",
      "SQL",
      "Statistics",
      "Probability",
      "Pandas",
      "NumPy",
      "Machine Learning",
      "Data Visualization",
      "Scikit-learn",
      "Jupyter",
    ];
  }

  if (
    role.includes("data analyst") ||
    role.includes("analyst")
  ) {
    return [
      "SQL",
      "Excel",
      "Python",
      "Statistics",
      "Power BI",
      "Tableau",
      "Data Visualization",
      "Pandas",
    ];
  }

  if (
    role.includes("software engineer") ||
    role.includes("software developer")
  ) {
    return [
      "DSA",
      "Python",
      "Java",
      "C++",
      "SQL",
      "Git",
      "REST APIs",
      "Databases",
      "OOP",
      "Problem Solving",
    ];
  }

  if (
    role.includes("full stack") ||
    role.includes("full-stack")
  ) {
    return [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "SQL",
      "MongoDB",
      "REST APIs",
      "Git",
    ];
  }

  if (
    role.includes("ai engineer") ||
    role.includes("artificial intelligence")
  ) {
    return [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "Computer Vision",
      "SQL",
      "APIs",
      "Deployment",
    ];
  }

  // Generic technology role

  return [
    "Python",
    "SQL",
    "DSA",
    "Git",
    "Problem Solving",
    "Communication",
  ];
}

// =====================================================
// CAREER CHAT
// =====================================================

export async function careerChat({
  message,
  context = {},
}) {
  const text =
    String(message || "").trim();

  const lower =
    text.toLowerCase();

  let reply =
    "I can help you with career planning, skill gaps, target roles, resumes, projects and learning roadmaps.";

  // ---------------------------------------------------
  // ML Engineer
  // ---------------------------------------------------

  if (
    lower.includes("ml engineer") ||
    lower.includes("machine learning")
  ) {
    reply =
      "For an ML Engineer path, focus on Python, DSA, SQL, statistics, machine learning fundamentals, scikit-learn, deep learning, APIs, Git and deployment. Build 2–3 strong end-to-end projects and practice DSA consistently.";
  }

  // ---------------------------------------------------
  // Data Scientist
  // ---------------------------------------------------

  else if (
    lower.includes("data scientist") ||
    lower.includes("data science")
  ) {
    reply =
      "For Data Science, prioritize Python, SQL, statistics, probability, exploratory data analysis, machine learning, visualization and experimentation. Then add strong portfolio projects using real datasets.";
  }

  // ---------------------------------------------------
  // Data Analyst
  // ---------------------------------------------------

  else if (
    lower.includes("data analyst") ||
    lower.includes("data analysis")
  ) {
    reply =
      "For Data Analytics, prioritize SQL, Excel, statistics, Python, Pandas, Power BI or Tableau, and data visualization. Build projects where you transform raw data into clear business insights.";
  }

  // ---------------------------------------------------
  // Software Engineer
  // ---------------------------------------------------

  else if (
    lower.includes("software engineer") ||
    lower.includes("software developer")
  ) {
    reply =
      "For Software Engineering placements, prioritize DSA, SQL, OOP, DBMS, operating systems, computer networks, Git and one strong programming language such as C++, Java or Python. Build projects that demonstrate real software development skills.";
  }

  // ---------------------------------------------------
  // Roadmap
  // ---------------------------------------------------

  else if (
    lower.includes("roadmap") ||
    lower.includes("what should i learn")
  ) {
    reply =
      "A practical roadmap is: strengthen Python and SQL → master DSA → learn statistics and ML → build end-to-end projects → learn APIs and deployment → optimize your resume → apply to role-specific opportunities.";
  }

  // ---------------------------------------------------
  // Resume
  // ---------------------------------------------------

  else if (
    lower.includes("resume") ||
    lower.includes("cv")
  ) {
    reply =
      "I recommend tailoring your resume to the target role, putting measurable project outcomes first, highlighting relevant technical skills, and removing unsupported claims. Your resume should show evidence rather than simply listing technologies.";
  }

  // ---------------------------------------------------
  // Skills
  // ---------------------------------------------------

  else if (
    lower.includes("skill") ||
    lower.includes("skills")
  ) {
    reply =
      "SkillBridge can compare your current skills with target-role requirements and identify the highest-priority gaps. Focus first on skills that repeatedly appear across your target opportunities.";
  }

  // ---------------------------------------------------
  // Projects
  // ---------------------------------------------------

  else if (
    lower.includes("project") ||
    lower.includes("projects")
  ) {
    reply =
      "Choose projects that demonstrate an end-to-end workflow: real input data → preprocessing → intelligent logic or ML model → backend/API → usable frontend → deployment. A smaller finished project is more valuable than a large unfinished one.";
  }

  // ---------------------------------------------------
  // DSA
  // ---------------------------------------------------

  else if (
    lower.includes("dsa") ||
    lower.includes("data structure") ||
    lower.includes("algorithm")
  ) {
    reply =
      "For placement-focused DSA, start with arrays and strings, then hashing, two pointers, sliding window, stacks, queues, linked lists, binary search, trees, heaps, graphs, recursion, dynamic programming and greedy algorithms. Practice consistently rather than trying to finish everything at once.";
  }

  // ---------------------------------------------------
  // SQL
  // ---------------------------------------------------

  else if (
    lower.includes("sql") ||
    lower.includes("database")
  ) {
    reply =
      "For SQL, master SELECT queries, filtering, GROUP BY, aggregate functions, joins, subqueries, CTEs, window functions, indexes and normalization. Practice solving business-style problems rather than memorizing syntax.";
  }

  // ---------------------------------------------------
  // Context-aware fallback
  // ---------------------------------------------------

  else if (
    context?.targetRole
  ) {
    reply =
      `For your target role of ${context.targetRole}, I can help you identify the most important skills, analyze your skill gaps, improve your resume and create a practical learning roadmap.`;
  }

  return {
    reply,
    context,
  };
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  reviewResume,
  careerChat,
};