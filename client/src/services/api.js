import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log(API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication APIs for login, registration, and fetching user info
export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

export const register = async (username, email, password, role = "USER") => {
  try {
    const response = await apiClient.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to get user info" };
  }
};

export const getUserPermissions = async () => {
  try {
    const response = await apiClient.get("/auth/permissions");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to get permissions" };
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Logout failed" };
  }
};

// Get tables based on user role (no LLM API)
export const getTables = async () => {
  try {
    const response = await apiClient.get("/tables");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch tables" };
  }
};

// Query APIs (require authentication)
export const executeQuery = async (question) => {
  try {
    const response = await apiClient.post("/query", { question });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Network error occurred" };
  }
};

export const getSchema = async () => {
  try {
    const response = await apiClient.get("/schema");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch schema" };
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Backend is not responding" };
  }
};
