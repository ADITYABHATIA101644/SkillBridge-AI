import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth/AuthContext";

export default function Login() {
  const navigate =
    useNavigate();

  const {
    login,
    register,
    authError,
  } = useAuth();

  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [targetRole, setTargetRole] =
    useState(
      "AI/ML Engineer"
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(
          email,
          password
        );
      } else {
        await register({
          name,
          email,
          password,
          targetRole,
        });
      }

      navigate("/");
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setError("");

    setMode(
      mode === "login"
        ? "register"
        : "login"
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-background-grid" />

      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-shell">

        <div className="auth-brand">
          <div className="auth-logo">
            S
          </div>

          <span>
            SkillBridge
            <b>.AI</b>
          </span>
        </div>

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="auth-badge">
              <span className="auth-badge-dot" />
              AI Career Intelligence
            </div>

            <h1>
              {mode === "login"
                ? "Welcome back."
                : "Build your career."}
            </h1>

            <p>
              {mode === "login"
                ? "Continue your personalized career journey."
                : "Create your AI-powered career intelligence profile."}
            </p>

          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="auth-form"
          >

            {mode === "register" && (
              <div className="auth-field">
                <label>
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Aditya Bhatia"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div className="auth-field">
              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                minLength={6}
                required
              />
            </div>

            {mode === "register" && (
              <div className="auth-field">
                <label>
                  Target career
                </label>

                <select
                  value={targetRole}
                  onChange={(e) =>
                    setTargetRole(
                      e.target.value
                    )
                  }
                >
                  <option>
                    AI/ML Engineer
                  </option>

                  <option>
                    Data Scientist
                  </option>

                  <option>
                    Software Engineer
                  </option>

                  <option>
                    Full Stack Developer
                  </option>
                </select>
              </div>
            )}

            {(error ||
              authError) && (
              <div className="auth-error">
                {error ||
                  authError}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Enter SkillBridge →"
                : "Create account →"}
            </button>

          </form>

          <div className="auth-switch">
            <span>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={
                switchMode
              }
            >
              {mode === "login"
                ? "Create account"
                : "Sign in"}
            </button>
          </div>

        </div>

        <div className="auth-footer">
          <span>
            SkillBridge AI
          </span>

          <span>
            Intelligent Talent &
            Workforce Ecosystem
          </span>
        </div>

      </div>
    </div>
  );
}