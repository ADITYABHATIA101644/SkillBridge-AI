import React, { useEffect, useMemo, useState } from "react";

import {
  getAssessmentRoles,
  getAssessmentQuestions,
  submitAssessment,
  getAssessmentHistory
} from "../api";

import "./Assessment.css";

export default function Assessment() {
  const [roles, setRoles] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedRole, setSelectedRole] =
    useState("");

  const [questions, setQuestions] =
    useState([]);

  const [answers, setAnswers] =
    useState({});

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [started, setStarted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!started || result) return;

    const timer = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, result]);

  async function loadInitialData() {
    try {
      setLoading(true);

      const [roleData, historyData] =
        await Promise.all([
          getAssessmentRoles(),
          getAssessmentHistory()
        ]);

      setRoles(roleData);
      setHistory(historyData);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load assessments."
      );
    } finally {
      setLoading(false);
    }
  }

  async function startAssessment() {
    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getAssessmentQuestions(
          selectedRole
        );

      if (!data.length) {
        throw new Error(
          "No questions available for this role."
        );
      }

      setQuestions(data);
      setAnswers({});
      setCurrentIndex(0);
      setSeconds(0);
      setResult(null);
      setStarted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to start assessment."
      );
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(index) {
    const question =
      questions[currentIndex];

    setAnswers((previous) => ({
      ...previous,
      [question.id]: index
    }));
  }

  function nextQuestion() {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (value) => value + 1
      );
    }
  }

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(
        (value) => value - 1
      );
    }
  }

  async function finishAssessment() {
    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers =
        questions.map((question) => ({
          questionId: question.id,
          selectedAnswer:
            answers[question.id] ?? -1
        }));

      const response =
        await submitAssessment(
          selectedRole,
          formattedAnswers,
          seconds
        );

      setResult(response.result);

      const historyData =
        await getAssessmentHistory();

      setHistory(historyData);
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setStarted(false);
    setResult(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setSeconds(0);
  }

  const currentQuestion =
    questions[currentIndex];

  const answeredCount =
    Object.keys(answers).length;

  const progress =
    questions.length
      ? ((currentIndex + 1) /
          questions.length) *
        100
      : 0;

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remaining =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(
      2,
      "0"
    )}`;
  }, [seconds]);

  if (loading && !started) {
    return (
      <div className="assessment-page">
        <div className="assessment-loading">
          Loading your assessment...
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <div>
          <span className="assessment-eyebrow">
            SKILLBRIDGE AI
          </span>

          <h1>
            Role Readiness
            <em> Assessment</em>
          </h1>

          <p>
            Test your knowledge against
            the skills required for your
            target career.
          </p>
        </div>

        {!started && !result && (
          <div className="assessment-header-badge">
            AI Career Intelligence
          </div>
        )}
      </div>

      {error && (
        <div className="assessment-error">
          {error}
        </div>
      )}

      {!started && !result && (
        <>
          <section className="assessment-start-card">
            <div className="start-card-content">
              <span className="start-kicker">
                SELECT YOUR TARGET ROLE
              </span>

              <h2>
                What career are you
                preparing for?
              </h2>

              <p>
                SkillBridge will generate a
                role-specific assessment and
                analyze your strengths and
                skill gaps.
              </p>

              <div className="role-grid">
                {roles.map((role) => (
                  <button
                    key={role.name}
                    className={`role-choice ${
                      selectedRole === role.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedRole(
                        role.name
                      )
                    }
                  >
                    <span className="role-icon">
                      {getRoleIcon(role.name)}
                    </span>

                    <span className="role-info">
                      <strong>
                        {role.name}
                      </strong>

                      <small>
                        {role.questionCount}{" "}
                        questions
                      </small>
                    </span>

                    <span className="role-arrow">
                      →
                    </span>
                  </button>
                ))}
              </div>

              <button
                className="assessment-primary-button"
                onClick={startAssessment}
                disabled={!selectedRole}
              >
                Start Assessment
                <span>→</span>
              </button>
            </div>

            <div className="assessment-preview">
              <div className="preview-orbit">
                <div className="preview-core">
                  AI
                </div>

                <div className="preview-pill pill-one">
                  Skills
                </div>

                <div className="preview-pill pill-two">
                  Role Match
                </div>

                <div className="preview-pill pill-three">
                  Readiness
                </div>
              </div>
            </div>
          </section>

          {history.length > 0 && (
            <section className="history-section">
              <div className="section-heading">
                <div>
                  <span>
                    YOUR PROGRESS
                  </span>

                  <h2>
                    Previous assessments
                  </h2>
                </div>
              </div>

              <div className="history-grid">
                {history.map((item) => (
                  <div
                    className="history-card"
                    key={item._id}
                  >
                    <div className="history-card-top">
                      <strong>
                        {item.role}
                      </strong>

                      <span>
                        {item.score}%
                      </span>
                    </div>

                    <div className="history-bar">
                      <span
                        style={{
                          width: `${item.score}%`
                        }}
                      />
                    </div>

                    <div className="history-meta">
                      <span>
                        {item.correctAnswers}/
                        {item.totalQuestions}{" "}
                        correct
                      </span>

                      <span>
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {started &&
        !result &&
        currentQuestion && (
          <section className="quiz-section">
            <div className="quiz-topbar">
              <div>
                <span className="quiz-role">
                  {selectedRole}
                </span>

                <h2>
                  Technical Readiness
                </h2>
              </div>

              <div className="quiz-timer">
                <span>TIME</span>
                <strong>
                  {formattedTime}
                </strong>
              </div>
            </div>

            <div className="quiz-progress">
              <div>
                <span>
                  Question{" "}
                  {currentIndex + 1} of{" "}
                  {questions.length}
                </span>

                <span>
                  {answeredCount}/
                  {questions.length} answered
                </span>
              </div>

              <div className="quiz-progress-track">
                <span
                  style={{
                    width: `${progress}%`
                  }}
                />
              </div>
            </div>

            <div className="question-card">
              <div className="question-meta">
                <span>
                  {currentQuestion.skill}
                </span>

                <span>
                  {currentQuestion.difficulty}
                </span>
              </div>

              <h3>
                {currentQuestion.question}
              </h3>

              <div className="answer-options">
                {currentQuestion.options.map(
                  (option, index) => (
                    <button
                      key={option}
                      className={`answer-option ${
                        answers[
                          currentQuestion.id
                        ] === index
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        chooseAnswer(index)
                      }
                    >
                      <span className="option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span>
                        {option}
                      </span>

                      <span className="option-check">
                        ✓
                      </span>
                    </button>
                  )
                )}
              </div>

              <div className="question-actions">
                <button
                  className="secondary-action"
                  onClick={previousQuestion}
                  disabled={
                    currentIndex === 0
                  }
                >
                  ← Previous
                </button>

                {currentIndex ===
                questions.length - 1 ? (
                  <button
                    className="assessment-primary-button"
                    onClick={
                      finishAssessment
                    }
                    disabled={submitting}
                  >
                    {submitting
                      ? "Analyzing..."
                      : "Finish Assessment"}
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    className="assessment-primary-button"
                    onClick={nextQuestion}
                  >
                    Next Question
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

      {result && (
        <section className="result-section">
          <div className="result-hero">
            <div>
              <span className="assessment-eyebrow">
                ASSESSMENT COMPLETE
              </span>

              <h2>
                Your{" "}
                <em>
                  {result.role}
                </em>{" "}
                readiness
              </h2>

              <p>
                SkillBridge analyzed your
                performance across
                role-specific competencies.
              </p>
            </div>

            <div className="score-circle">
              <strong>
                {result.score}
              </strong>
              <span>/ 100</span>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-main-card">
              <div className="result-card-heading">
                <span>
                  SKILL INTELLIGENCE
                </span>

                <h3>
                  Your competency profile
                </h3>
              </div>

              <div className="skill-result-list">
                {result.skillScores.map(
                  (skill) => (
                    <div
                      className="skill-result"
                      key={skill.skill}
                    >
                      <div>
                        <strong>
                          {skill.skill}
                        </strong>

                        <span>
                          {skill.percentage}%
                        </span>
                      </div>

                      <div className="skill-result-track">
                        <span
                          style={{
                            width: `${skill.percentage}%`
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="result-side-card">
              <span>
                OVERALL READINESS
              </span>

              <div className="big-result-score">
                {result.score}%
              </div>

              <p>
                {getReadinessMessage(
                  result.score
                )}
              </p>
            </div>
          </div>

          <div className="insight-grid">
            <div className="insight-card strength">
              <span>
                STRONGEST AREAS
              </span>

              <h3>
                Where you're strong
              </h3>

              {result.strengths.length ? (
                result.strengths.map(
                  (skill) => (
                    <div
                      className="insight-item"
                      key={skill}
                    >
                      <span>✓</span>
                      {skill}
                    </div>
                  )
                )
              ) : (
                <p>
                  Keep practicing to build
                  stronger competency areas.
                </p>
              )}
            </div>

            <div className="insight-card gap">
              <span>
                SKILL GAPS
              </span>

              <h3>
                Where to improve
              </h3>

              {result.gaps.length ? (
                result.gaps.map((skill) => (
                  <div
                    className="insight-item"
                    key={skill}
                  >
                    <span>!</span>
                    {skill}
                  </div>
                ))
              ) : (
                <p>
                  No major skill gaps were
                  detected.
                </p>
              )}
            </div>

            <div className="insight-card recommendation">
              <span>
                NEXT STEPS
              </span>

              <h3>
                Recommended actions
              </h3>

              {result.recommendations.map(
                (item) => (
                  <div
                    className="recommendation-item"
                    key={item}
                  >
                    <span>→</span>
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="result-actions">
            <button
              className="secondary-action"
              onClick={restart}
            >
              Retake Assessment
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function getRoleIcon(role) {
  const icons = {
    "Machine Learning Engineer": "ML",
    "Data Scientist": "DS",
    "AI Engineer": "AI",
    "Full Stack Developer": "FS",
    "Software Engineer": "SE",
    "Data Analyst": "DA",
    "MLOps Engineer": "MO",
    "Backend Developer": "BE",
    "Frontend Developer": "FE",
    "Cloud Engineer": "CL"
  };

  return icons[role] || "AI";
}

function getReadinessMessage(score) {
  if (score >= 85) {
    return "Excellent role readiness. Focus on advanced concepts, projects and real-world problem solving.";
  }

  if (score >= 70) {
    return "Strong foundation. Strengthen your weaker competencies and continue building practical experience.";
  }

  if (score >= 50) {
    return "You have a developing foundation. Focus on the identified skill gaps before attempting advanced assessments.";
  }

  return "Your fundamentals need more work. Follow a structured learning roadmap and retake the assessment.";
}