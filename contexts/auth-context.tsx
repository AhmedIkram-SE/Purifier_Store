"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" };

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  const [token, setToken] = React.useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_USER", payload: data.user });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      dispatch({ type: "SET_USER", payload: null });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_USER", payload: data.user });
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        }
        return { success: true };
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Network error" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_USER", payload: data.user });
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        }
        return { success: true };
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("token");
      setToken(null);
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      setToken(null);
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        token,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
