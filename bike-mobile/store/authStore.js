// store/authStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../constants/api";

/* ---------------- Helper ---------------- */
const saveSession = async (user, token) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
  await AsyncStorage.setItem("token", token);
};

/* ---------------- Store ---------------- */
export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  /* ================= REGISTER ================= */
  register: async (username, email, password, mobile, contact1, contact2) => {
    set({ isLoading: true });

    try {
      console.log("🔗 API_URL:", API_URL);
      console.log("📤 Register payload:", {
        username,
        email,
        password,
        mobile,
        contact1,
        contact2,
      });

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          mobile,
          contact1,
          contact2,
        }),
      });

      console.log("📥 Response status:", response.status);

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (!response.ok) throw new Error(data.message);

      await saveSession(data.user, data.token);

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      console.log("❌ Register error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },



  /* ================= LOGIN ================= */
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await saveSession(data.user, data.token);

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  /* ================= CHECK AUTH ================= */
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log("❌ Auth check failed:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  /* ================= LOGOUT ================= */
  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
  },

  /* ================= FETCH PROFILE ================= */
  fetchProfile: async () => {
    const { token } = get();

    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.setItem("user", JSON.stringify(data));
      set({ user: data });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /* ================= UPDATE PROFILE ================= */
  updateProfile: async (username, mobile) => {
    const { token } = get();

    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, mobile }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.setItem("user", JSON.stringify(data));
      set({ user: data });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /* ================= UPDATE EMERGENCY CONTACTS ================= */
  updateContacts: async (contact1, contact2) => {
    const { token } = get();

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contact1, contact2 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /* ================= DELETE ACCOUNT ================= */
  deleteAccount: async () => {
    const { token } = get();

    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      await AsyncStorage.clear();
      set({ user: null, token: null });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}));
