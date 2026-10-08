import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import resumesRouter from "./routes/resumes.js";
import jobsRouter from "./routes/jobs.js";
import aiRouter from "./routes/ai.js";
import assessmentRouter from "./routes/assessment.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/health", healthRouter);

app.use("/api/auth", authRouter);

app.use("/api/resumes", resumesRouter);

app.use("/api/jobs", jobsRouter);

app.use("/api/ai", aiRouter);

app.use("/api/assessment", assessmentRouter);

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge AI backend is running.",
    version: "1.0.0",
  });
});

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.originalUrl,
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error("Global server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message ||
      "Internal server error.",
  });
});

/*
|--------------------------------------------------------------------------
| MongoDB + Server
|--------------------------------------------------------------------------
*/

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from backend/.env"
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(
        `SkillBridge AI backend running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start SkillBridge backend:",
      error
    );

    process.exit(1);
  }
}

startServer();