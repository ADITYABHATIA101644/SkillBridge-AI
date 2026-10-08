import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({
  children,
}) {
  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-orb" />

        <p>
          Loading SkillBridge AI...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return children;
}