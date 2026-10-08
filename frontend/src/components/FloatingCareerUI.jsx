import React from "react";

export default function FloatingCareerUI() {
  return (
    <div className="floating-career-stage">

      {/* Background glow */}
      <div className="floating-glow glow-one" />
      <div className="floating-glow glow-two" />

      {/* Interview question */}
      <div className="floating-card interview-card">
        <div className="floating-card-label">
          AI INTERVIEW
        </div>

        <div className="interviewer-row">
          <div className="avatar interviewer-avatar">
            AI
          </div>

          <div>
            <strong>Interviewer</strong>
            <span>Technical Round</span>
          </div>
        </div>

        <div className="question">
          "Tell me about your
          machine learning project."
        </div>

        <div className="question-wave">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>


      {/* Candidate */}
      <div className="floating-card candidate-card">

        <div className="floating-card-label">
          CANDIDATE
        </div>

        <div className="candidate-face">
          👤
        </div>

        <div className="candidate-status">
          <span />
          Skill confidence is low
        </div>

      </div>


      {/* Skill chips */}
      <div className="floating-skill skill-python">
        <span className="skill-dot success" />
        Python
        <b>Strong</b>
      </div>

      <div className="floating-skill skill-sql">
        <span className="skill-dot success" />
        SQL
        <b>Strong</b>
      </div>

      <div className="floating-skill skill-ml">
        <span className="skill-dot warning" />
        Machine Learning
        <b>Needs work</b>
      </div>

      <div className="floating-skill skill-mlops">
        <span className="skill-dot danger" />
        MLOps
        <b>Missing</b>
      </div>


      {/* Central AI intelligence */}
      <div className="ai-core">

        <div className="ai-core-ring ring-one" />
        <div className="ai-core-ring ring-two" />

        <div className="ai-core-center">
          <span>AI</span>
        </div>

        <div className="ai-core-label">
          Skill Intelligence
        </div>

      </div>


      {/* Career match */}
      <div className="floating-card career-card">

        <div className="career-top">
          <div>
            <small>CAREER MATCH</small>
            <strong>AI / ML Engineer</strong>
          </div>

          <div className="match-score">
            82%
          </div>
        </div>

        <div className="match-bar">
          <span />
        </div>

        <div className="career-bottom">
          <span>12 skills matched</span>
          <span>4 gaps found</span>
        </div>

      </div>


      {/* Resume */}
      <div className="floating-card resume-card">

        <div className="resume-icon">
          CV
        </div>

        <div>
          <small>RESUME ANALYSIS</small>
          <strong>Resume.pdf</strong>
        </div>

        <div className="resume-score">
          78
        </div>

      </div>


      {/* Connecting lines */}
      <div className="connection connection-one" />
      <div className="connection connection-two" />
      <div className="connection connection-three" />

    </div>
  );
}