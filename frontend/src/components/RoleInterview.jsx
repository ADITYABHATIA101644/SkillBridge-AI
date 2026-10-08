import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import interviewQuestions from "../data/interviewQuestions";

const ROLE_META = {
  "Machine Learning": {
    icon: "ML",
    description:
      "Test your understanding of machine learning algorithms, model evaluation, preprocessing and core concepts.",
  },

  "Data Scientist": {
    icon: "DS",
    description:
      "Evaluate your knowledge of statistics, data analysis, SQL, experimentation and data science workflows.",
  },

  "AI Engineer": {
    icon: "AI",
    description:
      "Assess your understanding of AI systems, neural networks, LLMs, embeddings, RAG and AI engineering.",
  },

  "Software Engineer": {
    icon: "SE",
    description:
      "Test your fundamentals in programming, DSA, databases, software engineering and problem solving.",
  },

  "Full Stack Developer": {
    icon: "FS",
    description:
      "Evaluate frontend, backend, APIs, databases, authentication and modern web development concepts.",
  },
};

export default function RoleInterview() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const questions = selectedRole
    ? interviewQuestions[selectedRole] || []
    : [];

  const currentQuestion = questions[currentIndex];

  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  const result = useMemo(() => {
    if (!questions.length) {
      return {
        correct: 0,
        total: 0,
        percentage: 0,
        skills: {},
      };
    }

    let correct = 0;
    const skills = {};

    questions.forEach((question, index) => {
      const skill = question.skill || "Core Concepts";

      if (!skills[skill]) {
        skills[skill] = {
          correct: 0,
          total: 0,
        };
      }

      skills[skill].total += 1;

      if (answers[index] === question.answer) {
        correct += 1;
        skills[skill].correct += 1;
      }
    });

    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      skills,
    };
  }, [answers, questions]);

  const startInterview = () => {
    if (!selectedRole) return;

    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = selectedAnswer;

    setAnswers(updatedAnswers);

    if (currentIndex === questions.length - 1) {
      const correct = questions.reduce((score, question, index) => {
        return (
          score +
          (updatedAnswers[index] === question.answer ? 1 : 0)
        );
      }, 0);

      const percentage = Math.round(
        (correct / questions.length) * 100
      );

      localStorage.setItem(
        "skillbridgeInterviewResult",
        JSON.stringify({
          role: selectedRole,
          score: correct,
          total: questions.length,
          percentage,
          completedAt: new Date().toISOString(),
        })
      );

      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedAnswer(null);
  };

  const restartInterview = () => {
    setStarted(false);
    setFinished(false);
    setSelectedRole("");
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
  };

  const getResultMessage = () => {
    if (result.percentage >= 85) {
      return "Excellent performance. You demonstrate strong readiness for this role.";
    }

    if (result.percentage >= 70) {
      return "Good performance. You have a solid foundation with a few areas to strengthen.";
    }

    if (result.percentage >= 50) {
      return "You have a useful foundation, but several skills need improvement before you are fully interview-ready.";
    }

    return "Your assessment identified several important skill gaps. Use the recommended learning path to improve your readiness.";
  };

  const getSkillPercentage = (skillData) => {
    if (!skillData.total) return 0;

    return Math.round(
      (skillData.correct / skillData.total) * 100
    );
  };

  if (!started) {
    return (
      <main className="role-interview-page">
        <div className="role-interview-shell">

          <button
            className="assessment-back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <section className="assessment-hero">
            <div className="assessment-eyebrow">
              SKILLBRIDGE AI · CAREER ASSESSMENT
            </div>

            <h1>
              Test your skills for your
              <span> target career.</span>
            </h1>

            <p>
              Select a career role and take a role-specific technical
              assessment. Your performance will reveal strengths,
              weaknesses and areas that need improvement.
            </p>
          </section>

          <section className="role-selection-section">

            <div className="section-heading">
              <div>
                <span>01</span>
                <h2>Select your target role</h2>
              </div>

              <p>
                The questions will automatically change according
                to the role you choose.
              </p>
            </div>

            <div className="role-selection-grid">
              {Object.entries(ROLE_META).map(
                ([role, meta]) => (
                  <button
                    key={role}
                    className={`role-option ${
                      selectedRole === role
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="role-option-top">
                      <div className="role-icon">
                        {meta.icon}
                      </div>

                      <div
                        className={`role-radio ${
                          selectedRole === role
                            ? "checked"
                            : ""
                        }`}
                      >
                        {selectedRole === role && "✓"}
                      </div>
                    </div>

                    <h3>{role}</h3>

                    <p>{meta.description}</p>

                    <div className="role-question-count">
                      {interviewQuestions[role]?.length || 0}{" "}
                      questions
                    </div>
                  </button>
                )
              )}
            </div>

            <div className="assessment-start-row">
              <button
                className="assessment-start-button"
                disabled={!selectedRole}
                onClick={startInterview}
              >
                Start Assessment
                <span>→</span>
              </button>
            </div>

          </section>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="role-interview-page">
        <div className="role-interview-shell">

          <section className="assessment-result">

            <div className="result-eyebrow">
              ASSESSMENT COMPLETE
            </div>

            <h1>
              Your {selectedRole}
              <span> assessment result.</span>
            </h1>

            <p className="result-description">
              {getResultMessage()}
            </p>

            <div className="result-main-card">

              <div className="result-score">
                <div className="score-circle">
                  <strong>{result.percentage}%</strong>
                  <span>Score</span>
                </div>

                <div className="score-details">
                  <span className="score-role">
                    {selectedRole}
                  </span>

                  <h2>
                    {result.correct} / {result.total}
                  </h2>

                  <p>Questions answered correctly</p>
                </div>
              </div>

              <div className="result-divider" />

              <div className="skill-breakdown">

                <div className="breakdown-heading">
                  <span>SKILL INTELLIGENCE</span>
                  <h2>Performance by skill</h2>
                </div>

                {Object.entries(result.skills).map(
                  ([skill, data]) => {
                    const percentage =
                      getSkillPercentage(data);

                    return (
                      <div
                        className="skill-result"
                        key={skill}
                      >
                        <div className="skill-result-header">
                          <span>{skill}</span>
                          <strong>
                            {percentage}%
                          </strong>
                        </div>

                        <div className="skill-result-bar">
                          <span
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <small>
                          {data.correct} of {data.total}{" "}
                          correct
                        </small>
                      </div>
                    );
                  }
                )}

              </div>
            </div>

            <div className="result-actions">

              <button
                className="assessment-secondary-button"
                onClick={restartInterview}
              >
                Take Another Assessment
              </button>

              <button
                className="assessment-primary-button"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
                <span>→</span>
              </button>

            </div>

          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="role-interview-page">
      <div className="role-interview-shell">

        <div className="interview-topbar">

          <button
            className="assessment-back-button"
            onClick={() => setStarted(false)}
          >
            ← Exit Assessment
          </button>

          <div className="interview-role-label">
            {selectedRole}
          </div>

          <div className="interview-progress-text">
            {currentIndex + 1} / {questions.length}
          </div>

        </div>

        <div className="interview-progress">
          <span
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <section className="interview-question-section">

          <div className="question-meta">
            <span>
              QUESTION {String(currentIndex + 1).padStart(2, "0")}
            </span>

            {currentQuestion?.difficulty && (
              <span className="difficulty">
                {currentQuestion.difficulty}
              </span>
            )}
          </div>

          <div className="interview-question-card">

            <div className="question-number">
              {String(currentIndex + 1).padStart(2, "0")}
            </div>

            <div className="question-content">

              <h1>
                {currentQuestion?.question}
              </h1>

              <div className="interview-options">

                {currentQuestion?.options?.map(
                  (option, index) => (
                    <button
                      key={option}
                      className={`interview-option ${
                        selectedAnswer === index
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleAnswer(index)
                      }
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="option-text">
                        {option}
                      </span>

                      <span className="option-check">
                        {selectedAnswer === index
                          ? "✓"
                          : "→"}
                      </span>
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

          <div className="interview-footer">

            <span>
              Choose the answer you believe is most accurate.
            </span>

            <button
              className="assessment-next-button"
              disabled={selectedAnswer === null}
              onClick={nextQuestion}
            >
              {currentIndex === questions.length - 1
                ? "Finish Assessment"
                : "Next Question"}

              <span>→</span>
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}