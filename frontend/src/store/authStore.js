import { create } from "zustand";

import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: false,

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
}));
