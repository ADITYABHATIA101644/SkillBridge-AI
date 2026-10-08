import express from "express";
import mongoose from "mongoose";

import roleQuestions from "../data/roleQuestions.js";
import Assessment from "../models/Assessment.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
|
| Every assessment endpoint requires a logged-in user.
|
*/

router.use(authenticateToken);

/*
|--------------------------------------------------------------------------
| GET /api/assessment/roles
|--------------------------------------------------------------------------
|
| Returns all available assessment roles.
|
*/

router.get("/roles", (req, res) => {
  try {
    const roles = Object.keys(roleQuestions).map((role) => ({
      name: role,
      questionCount: roleQuestions[role].length,
    }));

    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Assessment roles error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment roles.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/assessment/questions/:role
|--------------------------------------------------------------------------
|
| Returns questions WITHOUT exposing correct answers.
|
*/

router.get("/questions/:role", (req, res) => {
  try {
    const role = decodeURIComponent(req.params.role);

    const questions = roleQuestions[role];

    if (!questions) {
      return res.status(404).json({
        success: false,
        message: `Assessment for "${role}" is not available.`,
      });
    }

    const safeQuestions = questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      skill: question.skill,
      difficulty: question.difficulty,
    }));

    return res.status(200).json({
      success: true,
      role,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Assessment questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment questions.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/assessment/submit
|--------------------------------------------------------------------------
|
| Checks submitted answers on the backend.
| Correct answers are NEVER trusted from the frontend.
|
*/

router.post("/submit", async (req, res) => {
  try {
    const {
      role,
      answers = [],
      durationSeconds = 0,
    } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    const questions = roleQuestions[role];

    if (!questions) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment role.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create answer map
    |--------------------------------------------------------------------------
    */

    const answerMap = new Map(
      answers.map((item) => [
        item.questionId,
        Number(item.selectedAnswer),
      ])
    );

    let correctAnswers = 0;

    const skillMap = {};

    /*
    |--------------------------------------------------------------------------
    | Evaluate every question
    |--------------------------------------------------------------------------
    */

    const processedAnswers = questions.map((question) => {
      const selectedAnswer = answerMap.has(question.id)
        ? answerMap.get(question.id)
        : -1;

      const correct = selectedAnswer === question.answer;

      if (correct) {
        correctAnswers++;
      }

      if (!skillMap[question.skill]) {
        skillMap[question.skill] = {
          correct: 0,
          total: 0,
        };
      }

      skillMap[question.skill].total++;

      if (correct) {
        skillMap[question.skill].correct++;
      }

      return {
        questionId: question.id,
        selectedAnswer,
        correct,
        skill: question.skill,
        difficulty: question.difficulty,
      };
    });

    /*
    |--------------------------------------------------------------------------
    | Overall score
    |--------------------------------------------------------------------------
    */

    const score =
      questions.length > 0
        ? Math.round(
            (correctAnswers / questions.length) * 100
          )
        : 0;

    /*
    |--------------------------------------------------------------------------
    | Skill scores
    |--------------------------------------------------------------------------
    */

    const skillScores = Object.entries(skillMap).map(
      ([skill, values]) => ({
        skill,
        correct: values.correct,
        total: values.total,
        percentage:
          values.total > 0
            ? Math.round(
                (values.correct / values.total) * 100
              )
            : 0,
      })
    );

    /*
    |--------------------------------------------------------------------------
    | Strengths
    |--------------------------------------------------------------------------
    */

    const strengths = skillScores
      .filter((item) => item.percentage >= 75)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4)
      .map((item) => item.skill);

    /*
    |--------------------------------------------------------------------------
    | Skill gaps
    |--------------------------------------------------------------------------
    */

    const gaps = skillScores
      .filter((item) => item.percentage < 60)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 4)
      .map((item) => item.skill);

    /*
    |--------------------------------------------------------------------------
    | Recommendations
    |--------------------------------------------------------------------------
    */

    const recommendations = gaps.map(
      (skill) =>
        `Improve ${skill} through focused practice, projects and role-specific interview preparation.`
    );

    if (recommendations.length === 0) {
      recommendations.push(
        "Continue practicing advanced role-specific problems.",
        "Build a portfolio project demonstrating your strongest skills.",
        "Attempt harder assessment questions to improve role readiness."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Save assessment
    |--------------------------------------------------------------------------
    */

    const assessment = await Assessment.create({
      userId: req.user.id,
      role,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      skillScores,
      strengths,
      gaps,
      recommendations,
      answers: processedAnswers,
      durationSeconds: Number(durationSeconds) || 0,
    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,
      message: "Assessment submitted successfully.",
      result: {
        id: assessment._id,
        role,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        skillScores,
        strengths,
        gaps,
        recommendations,
        durationSeconds: assessment.durationSeconds,
        createdAt: assessment.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Assessment submission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit assessment.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/assessment/history
|--------------------------------------------------------------------------
*/

router.get("/history", async (req, res) => {
  try {
    const assessments = await Assessment.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "role score totalQuestions correctAnswers strengths gaps skillScores createdAt durationSeconds"
      )
      .lean();

    return res.status(200).json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error(
      "Assessment history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment history.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/assessment/:id
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID.",
      });
    }

    const assessment = await Assessment.findOne({
      _id: id,
      userId: req.user.id,
    }).lean();

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error(
      "Assessment result error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment.",
    });
  }
});

export default router;