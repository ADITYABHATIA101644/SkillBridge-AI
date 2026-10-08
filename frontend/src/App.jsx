import { useEffect, useMemo, useRef, useState } from "react";
import ProblemScene3D from "./components/ProblemScene3D";
import FloatingCareerUI from "./components/FloatingCareerUI";
import Assessment from "./components/Assessment";
import RoleInterview from "./components/RoleInterview";
import {
  Routes,
  Route,
} from "react-router-dom";

import {
  uploadResume,
  getResumes,
  getJobs,
  getTrendingSkills,
  aiAssistant,
} from "./api";

import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "resume",
    label: "Resume Intelligence",
  },
  {
    id: "opportunities",
    label: "Opportunities",
  },
  {
    id: "skills",
    label: "Skill Intelligence",
  },
  {
    id: "assessment",
    label: "Assessment",
  },
  {
    id: "copilot",
    label: "Career Copilot",
  },
];

const ROLES = [
  "AI/ML Engineer",
  "Data Scientist",
  "Software Engineer",
  "Full Stack Developer",
];

const FALLBACK_SKILLS = [
  "Python",
  "Machine Learning",
  "SQL",
  "React",
  "TensorFlow",
  "NLP",
  "Data Structures",
  "Git",
];

const FALLBACK_JOBS = [
  {
    id: "demo-1",
    title: "Machine Learning Engineer",
    company: "AI Product Company",
    location: "Bengaluru, India",
    type: "Full-time",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    description:
      "Build production ML systems, train models and work with engineering teams.",
  },
  {
    id: "demo-2",
    title: "Data Scientist",
    company: "Analytics Platform",
    location: "Hyderabad, India",
    type: "Full-time",
    skills: ["Python", "SQL", "Machine Learning"],
    description:
      "Develop predictive models and turn business data into actionable insights.",
  },
  {
    id: "demo-3",
    title: "Full Stack Developer",
    company: "Technology Startup",
    location: "Remote",
    type: "Full-time",
    skills: ["React", "Node.js", "MongoDB"],
    description:
      "Develop modern web applications across frontend and backend systems.",
  },
];

<div className="skillbridge-hero-visual">
  <ProblemScene3D />
</div>

function SkillBridgeDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [resume, setResume] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [selectedRole, setSelectedRole] = useState("AI/ML Engineer");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All");

  const [trendingSkills, setTrendingSkills] = useState([]);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi. I'm your SkillBridge career copilot. Ask me about your career path, skill gaps, DSA, SQL, projects, resumes or learning roadmap.",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState("");

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  /* -------------------------------------------------------
     INITIAL DATA
  ------------------------------------------------------- */

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [chatMessages]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
        setSelectedJob(null);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileMenu);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [mobileMenu]);

  async function loadInitialData() {
    try {
      const [resumeData, jobsData, skillsData] = await Promise.all([
        getResumes().catch(() => []),
        getJobs().catch(() => []),
        getTrendingSkills().catch(() => []),
      ]);

      const resumeList = Array.isArray(resumeData) ? resumeData : [];
      const jobList = Array.isArray(jobsData) ? jobsData : [];
      const skillList = Array.isArray(skillsData) ? skillsData : [];

      setResumes(resumeList);

      if (resumeList.length > 0) {
        setResume(resumeList[0]);
        if (resumeList[0].targetRole) {
          setSelectedRole(resumeList[0].targetRole);
        }
      }

      setJobs(jobList.length ? jobList : FALLBACK_JOBS);
      setTrendingSkills(
        skillList.length
          ? skillList
          : FALLBACK_SKILLS.map((name, index) => ({
              name,
              demand: Math.max(65, 96 - index * 4),
            }))
      );
    } catch (error) {
      console.error("Initial data loading failed:", error);

      setJobs(FALLBACK_JOBS);
      setTrendingSkills(
        FALLBACK_SKILLS.map((name, index) => ({
          name,
          demand: Math.max(65, 96 - index * 4),
        }))
      );
    }
  }

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function navigate(page) {
  // Remove accidental "/" from route-style values
  const cleanPage = String(page).replace(/^\/+/, "");

  // Assessment is a real React Router page
  if (cleanPage === "assessment") {
    window.history.pushState({}, "", "/assessment");
    window.dispatchEvent(new PopStateEvent("popstate"));
    setMobileMenu(false);
    return;
  }

  // Interview is also a real React Router page
  if (cleanPage === "interview") {
    window.history.pushState({}, "", "/interview");
    window.dispatchEvent(new PopStateEvent("popstate"));
    setMobileMenu(false);
    return;
  }

  setActivePage(cleanPage);
  setMobileMenu(false);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  /* -------------------------------------------------------
     RESUME
  ------------------------------------------------------- */

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extension = file.name.toLowerCase();

    const validExtension =
      extension.endsWith(".pdf") ||
      extension.endsWith(".doc") ||
      extension.endsWith(".docx");

    if (!allowed.includes(file.type) && !validExtension) {
      showToast("Please select a PDF, DOC or DOCX resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Resume must be smaller than 5 MB.");
      return;
    }

    setSelectedFile(file);
  }

  async function handleResumeUpload() {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    try {
      setUploading(true);

      const result = await uploadResume(
        selectedFile,
        selectedRole,
        "demo-user"
      );

      const uploadedResume = result?.resume || result?.data || result;

      if (uploadedResume) {
        setResume(uploadedResume);

        setResumes((previous) => {
          const withoutDuplicate = previous.filter(
            (item) => item._id !== uploadedResume._id
          );

          return [uploadedResume, ...withoutDuplicate];
        });
      }

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showToast("Resume analyzed successfully.");
      setActivePage("resume");
    } catch (error) {
      console.error(error);
      showToast(
        error?.message ||
          "Resume analysis failed. Make sure the backend is running."
      );
    } finally {
      setUploading(false);
    }
  }

  /* -------------------------------------------------------
     JOBS
  ------------------------------------------------------- */

  const filteredJobs = useMemo(() => {
    const source = jobs.length ? jobs : FALLBACK_JOBS;

    return source.filter((job) => {
      const searchText = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...(Array.isArray(job.skills) ? job.skills : []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(jobSearch.toLowerCase());

      const type =
        job.type ||
        job.jobType ||
        job.employmentType ||
        "Full-time";

      const matchesFilter =
        jobFilter === "All" ||
        type.toLowerCase().includes(jobFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [jobs, jobSearch, jobFilter]);

  /* -------------------------------------------------------
     COPILOT
  ------------------------------------------------------- */

  async function sendChatMessage(messageOverride = null) {
    const message = String(
      messageOverride !== null ? messageOverride : chatInput
    ).trim();

    if (!message || chatLoading) return;

    setChatInput("");

    const userMessage = {
      role: "user",
      content: message,
    };

    setChatMessages((previous) => [...previous, userMessage]);
    setChatLoading(true);

    try {
      const context = {
        targetRole: selectedRole,
        resume: resume
          ? {
              score: resume.score,
              skills: resume.skills,
              skillGaps: resume.skillGaps,
              strengths: resume.strengths,
            }
          : null,
      };

      const result = await aiAssistant({
        message,
        context,
      });

      const reply =
        result?.reply ||
        result?.message ||
        result?.data?.reply ||
        "I couldn't generate a response right now.";

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't connect to the career intelligence service. Please make sure the SkillBridge backend is running on port 4000.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleChatKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendChatMessage();
    }
  }

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */

  function showToast(message) {
    setToast(message);

    window.clearTimeout(window.__skillBridgeToast);

    window.__skillBridgeToast = window.setTimeout(() => {
      setToast("");
    }, 3500);
  }

  function getResumeScore() {
    if (!resume) return 0;

    return Number(
      resume.matchPercentage ??
        resume.score ??
        resume.analysis?.matchPercentage ??
        0
    );
  }

  function getSkills() {
    if (!resume?.skills?.length) return FALLBACK_SKILLS;

    return resume.skills;
  }

  function getSkillGaps() {
    if (!resume?.skillGaps?.length) {
      return ["SQL", "Docker", "System Design", "Advanced DSA"];
    }

    return resume.skillGaps;
  }

  function getStrengths() {
    if (!resume?.strengths?.length) {
      return ["Python", "Machine Learning", "React"];
    }

    return resume.strengths;
  }

  const score = getResumeScore();

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate("dashboard")}
          aria-label="SkillBridge AI home"
        >
          <span className="brand-mark">
            <BrandIcon />
          </span>

          <span className="brand-name">
            SkillBridge<span>.ai</span>
          </span>
        </button>

        <nav
          className={`desktop-nav ${mobileMenu ? "mobile-open" : ""}`}
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
  <button
    key={item.id}
    className={`nav-pill ${
      activePage === item.id ? "active" : ""
    }`}
    onClick={() => navigate(item.id)}
  >
    {item.label}
  </button>
))}
        </nav>

        <div className="header-actions">
          <button
            className="liquid-button header-cta"
            onClick={() => navigate("resume")}
          >
            Analyze Resume
            <ArrowIcon />
          </button>

          <button
            className={`menu-button ${mobileMenu ? "open" : ""}`}
            onClick={() => setMobileMenu((value) => !value)}
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-content">
        {activePage === "dashboard" && (
          <Dashboard
            resume={resume}
            score={score}
            skills={getSkills()}
            gaps={getSkillGaps()}
            strengths={getStrengths()}
            jobs={filteredJobs}
            trendingSkills={trendingSkills}
            onNavigate={navigate}
            onJobSelect={setSelectedJob}
          />
        )}

        {activePage === "resume" && (
          <ResumeIntelligence
            resume={resume}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedFile={selectedFile}
            fileInputRef={fileInputRef}
            uploading={uploading}
            onFileChange={handleFileChange}
            onUpload={handleResumeUpload}
            onNavigate={navigate}
          />
        )}

        {activePage === "opportunities" && (
          <Opportunities
            jobs={filteredJobs}
            search={jobSearch}
            setSearch={setJobSearch}
            filter={jobFilter}
            setFilter={setJobFilter}
            onSelect={setSelectedJob}
          />
        )}

        {activePage === "skills" && (
          <SkillIntelligence
            resume={resume}
            skills={getSkills()}
            gaps={getSkillGaps()}
            trendingSkills={trendingSkills}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        )}

        {activePage === "assessment" && (
  <Assessment />
)}

        {activePage === "copilot" && (
          <CareerCopilot
            messages={chatMessages}
            input={chatInput}
            setInput={setChatInput}
            loading={chatLoading}
            onSend={sendChatMessage}
            onKeyDown={handleChatKeyDown}
            chatEndRef={chatEndRef}
            resume={resume}
            selectedRole={selectedRole}
            onNavigate={navigate}
          />
        )}
      </main>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  resume,
  score,
  skills,
  gaps,
  strengths,
  jobs,
  trendingSkills,
  onNavigate,
  onJobSelect,
}) {
  return (
    <section className="page dashboard-page">
      <div className="hero-grid">
        <div className="hero-copy appear">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Intelligent Talent & Workforce Ecosystem
          </div>

          <h1>
            Turn your skills into
            <br />
            <em>career momentum.</em>
          </h1>

          <p className="hero-description">
            SkillBridge AI connects your resume, skills, market demand and
            career goals to show you what to learn, what to improve and where
            to go next.
          </p>

          <div className="hero-actions">
            <button
              className="liquid-button primary-button"
              onClick={() => onNavigate("resume")}
            >
              Analyze my resume
              <ArrowIcon />
            </button>

            <button
              className="glass-button"
              onClick={() => onNavigate("copilot")}
            >
              Talk to Career Copilot
            </button>
          </div>
        </div>

        <div className="hero-intelligence appear">
          <div className="intelligence-orbit">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />

            <div className="orbit-core">
              <span>AI</span>
              <small>CAREER<br />INTELLIGENCE</small>
            </div>

            <div className="floating-node node-one">
              <span>Resume</span>
              <b>↗</b>
            </div>

            <div className="floating-node node-two">
              <span>Skills</span>
              <b>✦</b>
            </div>

            <div className="floating-node node-three">
              <span>Market</span>
              <b>⌁</b>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-stats appear">
        <StatCard
          label="Resume Match"
          value={resume ? `${score}%` : "—"}
          subtext={resume ? "Target role alignment" : "Upload a resume"}
        />

        <StatCard
          label="Skills Detected"
          value={resume ? skills.length : "—"}
          subtext="From your profile"
        />

        <StatCard
          label="Skill Gaps"
          value={resume ? gaps.length : "—"}
          subtext="Prioritized for growth"
        />

        <StatCard
          label="Live Opportunities"
          value={jobs.length}
          subtext="Relevant roles"
        />
      </div>

      <div className="section-header appear">
        <div>
          <span className="section-kicker">Career intelligence</span>
          <h2>Your current career signal</h2>
        </div>

        <button
          className="text-button"
          onClick={() => onNavigate("skills")}
        >
          Explore skill intelligence
          <ArrowIcon />
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="panel profile-panel appear">
          <PanelHeading
            eyebrow="Profile"
            title="Your strongest signals"
            action="Resume intelligence"
            onAction={() => onNavigate("resume")}
          />

          <div className="signal-list">
            {strengths.slice(0, 5).map((skill, index) => (
              <div className="signal-row" key={skill}>
                <span className="signal-index">
                  0{index + 1}
                </span>

                <span className="signal-name">{skill}</span>

                <span className="signal-line">
                  <span
                    style={{
                      width: `${Math.max(
                        48,
                        94 - index * 9
                      )}%`,
                    }}
                  />
                </span>

                <span className="signal-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel gaps-panel appear">
          <PanelHeading
            eyebrow="Next moves"
            title="Skills worth closing"
            action="Build roadmap"
            onAction={() => onNavigate("copilot")}
          />

          <div className="gap-cloud">
            {gaps.slice(0, 7).map((gap, index) => (
              <span
                className={`skill-chip ${index === 0 ? "highlight" : ""}`}
                key={gap}
              >
                {gap}
              </span>
            ))}
          </div>

          <div className="recommendation-strip">
            <span className="recommendation-icon">✦</span>
            <div>
              <strong>AI recommendation</strong>
              <p>
                Prioritize one high-demand skill at a time and connect it
                to a portfolio project.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header appear">
        <div>
          <span className="section-kicker">Market pulse</span>
          <h2>Skills employers are looking for</h2>
        </div>

        <button
          className="text-button"
          onClick={() => onNavigate("opportunities")}
        >
          Browse opportunities
          <ArrowIcon />
        </button>
      </div>

      <div className="market-row appear">
        {(trendingSkills.length
          ? trendingSkills
          : FALLBACK_SKILLS.map((name, index) => ({
              name,
              demand: 90 - index * 4,
            }))
        )
          .slice(0, 8)
          .map((skill, index) => {
            const name =
              typeof skill === "string" ? skill : skill.name;

            const demand =
              typeof skill === "object"
                ? skill.demand ?? skill.score ?? 75
                : 90 - index * 4;

            return (
              <div className="market-card" key={name}>
                <div className="market-top">
                  <span>0{index + 1}</span>
                  <span>+{Math.round(demand)}%</span>
                </div>

                <h3>{name}</h3>

                <div className="market-bar">
                  <span style={{ width: `${demand}%` }} />
                </div>
              </div>
            );
          })}
      </div>

      <div className="section-header appear">
        <div>
          <span className="section-kicker">Opportunity feed</span>
          <h2>Roles aligned with your trajectory</h2>
        </div>
      </div>

      <div className="opportunity-preview appear">
        {jobs.slice(0, 3).map((job) => (
          <JobRow
            key={job._id || job.id || job.title}
            job={job}
            onSelect={() => onJobSelect(job)}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   RESUME PAGE
========================================================= */

function ResumeIntelligence({
  resume,
  selectedRole,
  setSelectedRole,
  selectedFile,
  fileInputRef,
  uploading,
  onFileChange,
  onUpload,
  onNavigate,
}) {
  const score = Number(
    resume?.matchPercentage ?? resume?.score ?? 0
  );

  return (
    <section className="page inner-page">
      <PageIntro
        eyebrow="01 / Resume intelligence"
        title={
          <>
            Let your resume
            <br />
            <em>speak in data.</em>
          </>
        }
        description="Upload your resume and SkillBridge extracts your skills, identifies gaps and maps your profile against your target role."
      />

      <div className="resume-layout">
        <div className="panel upload-panel appear">
          <div className="panel-number">01</div>

          <span className="section-kicker">Resume analysis</span>
          <h2>Upload your latest resume</h2>

          <p className="muted-copy">
            PDF, DOC or DOCX · maximum 5 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            onChange={onFileChange}
            hidden
          />

          <button
            className={`drop-zone ${
              selectedFile ? "has-file" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">
              <UploadIcon />
            </span>

            {selectedFile ? (
              <>
                <strong>{selectedFile.name}</strong>
                <small>Ready for analysis</small>
              </>
            ) : (
              <>
                <strong>Choose your resume</strong>
                <small>or click to browse files</small>
              </>
            )}
          </button>

          <label className="field-label">
            Target role
          </label>

          <div className="role-selector">
            {ROLES.map((role) => (
              <button
                key={role}
                className={selectedRole === role ? "selected" : ""}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            className="liquid-button full-button"
            onClick={onUpload}
            disabled={uploading}
          >
            {uploading ? "Analyzing resume..." : "Analyze resume"}
            {!uploading && <ArrowIcon />}
          </button>
        </div>

        <div className="panel resume-result-panel appear">
          <div className="result-header">
            <div>
              <span className="section-kicker">
                Latest intelligence
              </span>
              <h2>{resume ? "Your resume signal" : "Awaiting your resume"}</h2>
            </div>

            {resume && (
              <div className="score-ring">
                <div>
                  <strong>{score}</strong>
                  <span>%</span>
                </div>
              </div>
            )}
          </div>

          {!resume ? (
            <div className="empty-state">
              <div className="empty-orbit">
                <span>AI</span>
              </div>

              <h3>Your analysis will appear here.</h3>

              <p>
                Upload a resume to see detected skills, strengths,
                skill gaps and role alignment.
              </p>
            </div>
          ) : (
            <div className="analysis-result">
              <div className="analysis-block">
                <span className="analysis-label">
                  Detected skills
                </span>

                <div className="chip-grid">
                  {(resume.skills || []).map((skill) => (
                    <span className="skill-chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="analysis-columns">
                <AnalysisList
                  title="Strengths"
                  items={resume.strengths || []}
                  positive
                />

                <AnalysisList
                  title="Skill gaps"
                  items={resume.skillGaps || []}
                />
              </div>

              {resume.suggestions?.length > 0 && (
                <div className="recommendation-box">
                  <span>✦</span>

                  <div>
                    <strong>Recommended next steps</strong>

                    <ul>
                      {resume.suggestions
                        .slice(0, 4)
                        .map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="resume-flow appear">
        <FlowStep
          number="01"
          title="Extract"
          text="Skills and signals are extracted from your resume."
        />

        <FlowLine />

        <FlowStep
          number="02"
          title="Compare"
          text="Your profile is mapped against your target role."
        />

        <FlowLine />

        <FlowStep
          number="03"
          title="Identify"
          text="High-impact gaps are surfaced and prioritized."
        />

        <FlowLine />

        <FlowStep
          number="04"
          title="Improve"
          text="A practical roadmap turns gaps into action."
        />
      </div>

      <div className="bottom-action appear">
        <span>Ready to understand your next move?</span>

        <button
          className="text-button"
          onClick={() => onNavigate("copilot")}
        >
          Ask Career Copilot
          <ArrowIcon />
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   OPPORTUNITIES
========================================================= */

function Opportunities({
  jobs,
  search,
  setSearch,
  filter,
  setFilter,
  onSelect,
}) {
  return (
    <section className="page inner-page">
      <PageIntro
        eyebrow="02 / Opportunities"
        title={
          <>
            Find work that
            <br />
            <em>matches your signal.</em>
          </>
        }
        description="Explore roles based on skills, location and your current career direction."
      />

      <div className="opportunity-toolbar appear">
        <div className="search-field">
          <SearchIcon />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search roles, skills, companies..."
          />

          {search && (
            <button onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <div className="filter-group">
          {["All", "Full-time", "Internship", "Remote"].map(
            (item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      <div className="jobs-header appear">
        <span>{jobs.length} opportunities</span>

        <span>
          Sorted by relevance <span className="dim">↘</span>
        </span>
      </div>

      <div className="jobs-list appear">
        {jobs.length === 0 ? (
          <div className="empty-state wide">
            <h3>No matching opportunities.</h3>
            <p>Try another search or remove the filters.</p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <JobRow
              key={job._id || job.id || `${job.title}-${index}`}
              job={job}
              index={index}
              onSelect={() => onSelect(job)}
            />
          ))
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SKILL INTELLIGENCE
========================================================= */

function SkillIntelligence({
  resume,
  skills,
  gaps,
  trendingSkills,
  selectedRole,
  setSelectedRole,
}) {
  const normalizedSkills = skills.map((item) =>
    typeof item === "string" ? item : item.name
  );

  return (
    <section className="page inner-page">
      <PageIntro
        eyebrow="03 / Skill intelligence"
        title={
          <>
            Know what you have.
            <br />
            <em>Know what's next.</em>
          </>
        }
        description="SkillBridge turns your profile into a living map of capabilities, gaps and market demand."
      />

      <div className="skill-controls appear">
        <div>
          <span className="field-label">Target role</span>

          <div className="role-selector compact">
            {ROLES.map((role) => (
              <button
                key={role}
                className={selectedRole === role ? "selected" : ""}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-dashboard">
        <div className="panel skill-map-panel appear">
          <PanelHeading
            eyebrow="Your profile"
            title="Skill map"
          />

          <div className="skill-map">
            <div className="skill-map-center">
              <span>{resume ? "PROFILE" : "SKILL"}</span>
              <strong>
                {resume ? normalizedSkills.length : "—"}
              </strong>
              <small>skills</small>
            </div>

            {normalizedSkills.slice(0, 10).map((skill, index) => {
              const angle = (index / 10) * Math.PI * 2;
              const radius = 38;

              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;

              return (
                <div
                  className="map-node"
                  key={skill}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  {skill}
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel gap-panel-large appear">
          <PanelHeading
            eyebrow="Priority gaps"
            title="What to learn next"
          />

          <div className="priority-list">
            {gaps.slice(0, 6).map((gap, index) => (
              <div className="priority-row" key={gap}>
                <span className="priority-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="priority-main">
                  <strong>{gap}</strong>

                  <div className="priority-progress">
                    <span
                      style={{
                        width: `${Math.max(
                          18,
                          48 - index * 5
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="priority-label">
                  {index === 0
                    ? "High"
                    : index < 3
                    ? "Medium"
                    : "Explore"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-header appear">
        <div>
          <span className="section-kicker">
            Market demand
          </span>
          <h2>Trending skill signals</h2>
        </div>
      </div>

      <div className="demand-grid appear">
        {(trendingSkills.length
          ? trendingSkills
          : FALLBACK_SKILLS.map((name, index) => ({
              name,
              demand: 92 - index * 5,
            }))
        )
          .slice(0, 8)
          .map((item, index) => {
            const name =
              typeof item === "string" ? item : item.name;

            const demand =
              typeof item === "object"
                ? item.demand ?? item.score ?? 70
                : 92 - index * 5;

            return (
              <div className="demand-card" key={name}>
                <div className="demand-index">
                  0{index + 1}
                </div>

                <div className="demand-value">
                  {Math.round(demand)}
                  <small>%</small>
                </div>

                <h3>{name}</h3>

                <p>Market demand signal</p>

                <div className="demand-line">
                  <span
                    style={{
                      width: `${Math.min(100, demand)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

/* =========================================================
   CAREER COPILOT
========================================================= */

function CareerCopilot({
  messages,
  input,
  setInput,
  loading,
  onSend,
  onKeyDown,
  chatEndRef,
  resume,
  selectedRole,
  onNavigate,
}) {
  const quickQuestions = [
    "What skills should I learn for an ML Engineer role?",
    "Create a roadmap for my target role.",
    "How can I improve my resume?",
    "What DSA topics should I prepare?",
    "How important is SQL for placements?",
  ];

  return (
    <section className="page inner-page copilot-page">
      <PageIntro
        eyebrow="04 / Career copilot"
        title={
          <>
            Your career.
            <br />
            <em>One intelligent conversation.</em>
          </>
        }
        description="Ask questions about roles, resumes, DSA, SQL, projects, skill gaps or your next learning move."
      />

      <div className="copilot-layout">
        <aside className="copilot-context panel appear">
          <div className="copilot-orb">
            <span>✦</span>
          </div>

          <span className="section-kicker">
            Active context
          </span>

          <h2>{selectedRole}</h2>

          <p>
            Career Copilot is using your current role and resume
            intelligence to personalize its recommendations.
          </p>

          <div className="context-items">
            <ContextItem
              label="Resume"
              value={resume ? "Analyzed" : "Not uploaded"}
            />

            <ContextItem
              label="Target role"
              value={selectedRole}
            />

            <ContextItem
              label="Intelligence"
              value={resume ? "Personalized" : "General"}
            />
          </div>

          {!resume && (
            <button
              className="glass-button full-button"
              onClick={() => onNavigate("resume")}
            >
              Analyze resume
              <ArrowIcon />
            </button>
          )}
        </aside>

        <div className="copilot-chat panel appear">
          <div className="chat-header">
            <div>
              <span className="live-dot" />
              <strong>Career Copilot</strong>
            </div>

            <span>AI career intelligence</span>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="assistant-avatar">
                    ✦
                  </div>
                )}

                <div className="message-bubble">
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <div className="assistant-avatar">✦</div>

                <div className="message-bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="quick-questions">
            {quickQuestions.slice(0, 3).map((question) => (
              <button
                key={question}
                onClick={() => onSend(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chat-input-wrap">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={onKeyDown}
              placeholder="Ask anything about your career..."
              rows={1}
            />

            <button
              className="send-button"
              onClick={() => onSend()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="copilot-suggestions appear">
        <span className="section-kicker">
          Try asking
        </span>

        <div>
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => onSend(question)}
            >
              {question}
              <ArrowIcon />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="page-intro appear">
      <span className="section-kicker">{eyebrow}</span>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>
  );
}

function PanelHeading({
  eyebrow,
  title,
  action,
  onAction,
}) {
  return (
    <div className="panel-heading">
      <div>
        <span className="section-kicker">{eyebrow}</span>
        <h3>{title}</h3>
      </div>

      {action && (
        <button
          className="mini-action"
          onClick={onAction}
        >
          {action}
          <ArrowIcon />
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{subtext}</small>
    </div>
  );
}

function AnalysisList({ title, items, positive = false }) {
  return (
    <div className="analysis-list">
      <span className="analysis-label">{title}</span>

      {items.length ? (
        items.slice(0, 6).map((item) => (
          <div className="analysis-item" key={item}>
            <span className={positive ? "positive" : ""}>
              {positive ? "✓" : "→"}
            </span>

            {item}
          </div>
        ))
      ) : (
        <div className="analysis-item muted">
          No data available yet.
        </div>
      )}
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div className="flow-step">
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function FlowLine() {
  return <div className="flow-line" />;
}

function ContextItem({ label, value }) {
  return (
    <div className="context-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function JobRow({ job, index = 0, onSelect }) {
  const skills = Array.isArray(job.skills)
    ? job.skills
    : [];

  return (
    <button className="job-row" onClick={onSelect}>
      <div className="job-number">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="job-main">
        <div className="job-title-line">
          <h3>{job.title || "Untitled role"}</h3>

          <span className="job-type">
            {job.type ||
              job.jobType ||
              job.employmentType ||
              "Full-time"}
          </span>
        </div>

        <p>
          {job.company || "Company"}{" "}
          <span>·</span>{" "}
          {job.location || "India"}
        </p>

        {skills.length > 0 && (
          <div className="job-skills">
            {skills.slice(0, 4).map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        )}
      </div>

      <div className="job-arrow">
        <ArrowIcon />
      </div>
    </button>
  );
}

function JobModal({ job, onClose }) {
  const skills = Array.isArray(job.skills)
    ? job.skills
    : [];

  return (
    <div className="modal-layer" onClick={onClose}>
      <div
        className="job-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <span className="section-kicker">
          Opportunity
        </span>

        <h2>{job.title}</h2>

        <p className="modal-company">
          {job.company || "Company"} ·{" "}
          {job.location || "India"}
        </p>

        <div className="modal-meta">
          <span>
            {job.type ||
              job.jobType ||
              job.employmentType ||
              "Full-time"}
          </span>

          <span>SkillBridge match</span>
        </div>

        {job.description && (
          <div className="modal-section">
            <span>About the role</span>
            <p>{job.description}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="modal-section">
            <span>Skills</span>

            <div className="chip-grid">
              {skills.map((skill) => (
                <span className="skill-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className="liquid-button full-button"
          onClick={onClose}
        >
          Close opportunity
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function BrandIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(-30 12 12)">
        <circle cx="7.3" cy="3.2" r="1.45" fill="currentColor" />
        <rect
          x="5.5"
          y="4.7"
          width="3.6"
          height="14.6"
          rx="1.8"
          fill="currentColor"
        />
        <rect
          x="14.9"
          y="4.7"
          width="3.6"
          height="14.6"
          rx="1.8"
          fill="currentColor"
        />
        <circle
          cx="16.7"
          cy="20.8"
          r="1.45"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 16V4m0 0L7 9m5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="m16 16 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function App() {
  return (
    <Routes>

      {/* Public route */}
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/assessment"
        element={<Assessment />}
      />
      <Route
        path="/interview"
        element={
        <ProtectedRoute>
        <RoleInterview />
        </ProtectedRoute>
      }
      />
      {/* Protected application */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <SkillBridgeDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}