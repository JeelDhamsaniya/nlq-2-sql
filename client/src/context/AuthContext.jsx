import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user on mount (cookie will be sent automatically)
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to load user:", error);
      // Don't logout here, just set user to null
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Clear table cache before login
      localStorage.removeItem("library_tables_cache");

      const response = await apiLogin(email, password);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.error || "Login failed",
      };
    }
  };

  const register = async (username, email, password, role = "USER") => {
    try {
      const response = await apiRegister(username, email, password, role);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.error || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      // Call backend to clear cookie
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API call fails
    } finally {
      setUser(null);
      // Clear table cache on logout
      localStorage.removeItem("library_tables_cache");
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
