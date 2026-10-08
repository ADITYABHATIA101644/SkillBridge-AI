import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../api";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authError, setAuthError] =
    useState("");

  useEffect(() => {
    async function restoreSession() {
      const token =
        localStorage.getItem(
          "skillbridge_token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data =
          await getCurrentUser();

        setUser(
          data.user || null
        );
      } catch (error) {
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(
    email,
    password
  ) {
    setAuthError("");

    try {
      const data =
        await loginUser(
          email,
          password
        );

      setUser(
        data.user || null
      );

      return data;
    } catch (error) {
      setAuthError(
        error.message
      );

      throw error;
    }
  }

  async function register({
    name,
    email,
    password,
    targetRole,
  }) {
    setAuthError("");

    try {
      const data =
        await registerUser({
          name,
          email,
          password,
          targetRole,
        });

      setUser(
        data.user || null
      );

      return data;
    } catch (error) {
      setAuthError(
        error.message
      );

      throw error;
    }
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const value = {
    user,
    loading,
    authError,

    isAuthenticated:
      Boolean(user),

    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}