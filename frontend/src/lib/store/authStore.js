import { create } from "zustand";
import apiClient from "@/lib/api/apiClient";

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;

  return {
    ...rawUser,
    profilePic:
      rawUser.profilePic ||
      rawUser.avatar ||
      rawUser.avatarUrl ||
      rawUser.image ||
      "",
  };
};

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: true,

  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }

    set({
      user: normalizeUser(user),
      token: token || null,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },

  setUser: (userOrUpdater) =>
    set((state) => {
      const incoming =
        typeof userOrUpdater === "function"
          ? userOrUpdater(state.user)
          : userOrUpdater;

      const mergedUser = state.user
        ? { ...state.user, ...incoming }
        : incoming;

      return {
        user: normalizeUser(mergedUser),
      };
    }),

  fetchCurrentUser: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      set({
        isLoading: true,
        token,
        isAuthenticated: true,
      });

      const response = await apiClient.get("/users/profile");

      const userData =
        response.data?.data?.user ||
        response.data?.data?.profile ||
        response.data?.data ||
        response.data?.user ||
        response.data;

      if (!userData) {
        throw new Error("Profile response did not contain user data");
      }

      set({
        user: normalizeUser(userData),
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error(
        "Failed to restore session:",
        error.response?.status,
        error.response?.data || error.message
      );

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        set({
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));