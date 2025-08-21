import { create } from "zustand";

import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, fullname) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { email, password, fullname },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      return res.data;
    } catch (err) {
      set({ error: "Error in logging out", isLoading: false });
      throw err;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/verify-email`,
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (err) {
      set({
        error: err.response.data.message || "Error in Verifying Email",
        isLoading: false,
      });
      throw err;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message ||
          "Error in sending reset password email",
      });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });

      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error in Resetting Password",
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
}));
