# SkillBridge AI — Build For Bharat 2.0

**Problem:** Intelligent Talent and Workforce Ecosystem

SkillBridge AI is a full-stack AI-powered talent intelligence platform connecting **resume evidence → skills → roles → skill gaps → learning roadmap → live opportunities → AI career coaching**.

## Architecture

```text
SkillBridge-AI/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── App.jsx           # product UI + AI/live-market integrations
│   │   ├── engine.js         # resume/skill/role intelligence
│   │   ├── parse.js          # PDF/DOCX/TXT parsing + OCR
│   │   ├── api.js            # backend API client
│   │   └── i18n.js
│   └── package.json
├── backend/                  # Node + Express
│   ├── src/
│   │   ├── server.js         # API + Socket.IO + scheduled sync
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # resume/jobs/health APIs
│   │   └── services/         # Gemini AI + live jobs
│   ├── .env.example
│   └── package.json
└── package.json
```

## What is integrated

### 1. Resume intelligence
- PDF/DOCX/TXT upload
- OCR fallback for scanned PDFs
- Skill extraction and proficiency estimation
- Education, experience, projects and certification extraction
- Role matching
- Skill-gap analysis
- Career roadmap
- Resume comparison

### 2. MongoDB persistence
Every analyzed resume is sent to the backend and stored in MongoDB Atlas. The frontend keeps a local cache for fast demo use, while the backend becomes the persistent source.

### 3. Live workforce intelligence
The backend can sync current job listings from **Adzuna** every 10 minutes, store them in MongoDB, and expose them through `/api/jobs`.

Socket.IO broadcasts `jobs:updated` whenever a sync completes, so the frontend can refresh market intelligence without a page reload.

### 4. AI Career + Resume Assistant
Gemini powers:
- ATS-style resume review
- resume score
- missing keywords
- prioritized improvements
- truthful bullet rewrites
- career questions
- personalized next actions

If no Gemini key is configured, the application falls back to deterministic recommendations instead of crashing.

### 5. Real-time skill intelligence
The dashboard computes the most-mentioned skills from the MongoDB job dataset and updates when the job feed changes.

## Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Optional: Adzuna developer credentials
- Optional: Gemini API key

### 1. Install

```bash
npm install
npm run install:all
```

### 2. Configure backend

Copy:

```text
backend/.env.example → backend/.env
```

Set at least:

```env
MONGODB_URI=mongodb+srv://...
CLIENT_URL=http://localhost:5173
```

For live jobs:

```env
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
ADZUNA_COUNTRY=in
JOB_SYNC_MINUTES=10
```

For AI:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Run

From the project root:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:4000`

### API endpoints

- `GET /api/health`
- `GET /api/jobs`
- `GET /api/jobs/trending`
- `POST /api/jobs/sync`
- `GET /api/resumes?userId=...`
- `POST /api/resumes`
- `POST /api/resumes/:id/ai-review`
- `POST /api/resumes/:id/assistant`

## Hackathon story

**Problem Identification**
Students, professionals, recruiters and institutions lack one intelligence layer connecting skills, roles and workforce demand.

**Data Acquisition**
Resume data + public job-market data + MongoDB-stored historical observations.

**Data Preparation**
Resume parsing, NLP-style skill extraction, normalization, proficiency estimation and job normalization.

**Analytical Approach**
Role-skill requirement matrix, semantic-style skill matching, gap analysis, market skill frequency and AI reasoning.

**Insights / Predictions**
Role fit, missing skills, priority improvements, market demand signals and career pathways.

**Solution**
A personalized talent intelligence platform that tells a user not only *what they have*, but *what they should learn next and why*.

**Impact**
Students get a measurable roadmap, recruiters get explainable candidate signals, and institutions can identify curriculum/skill demand trends.

## Important demo note

The frontend's original local engine is retained deliberately. This means the hackathon demo still works even if a third-party AI/job API is unavailable. MongoDB, live jobs and Gemini become the production intelligence layer on top of that deterministic foundation.
