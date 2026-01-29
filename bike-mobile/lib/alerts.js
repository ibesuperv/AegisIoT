// lib/alerts.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../constants/api";

/* ---------------- Helper ---------------- */
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Authentication token missing");

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ---------------- GET ALL ALERTS ---------------- */
export const getAlerts = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/alerts`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch alerts");

  return data;
};

/* ---------------- GET ALERTS BY ACCIDENT ---------------- */
export const getAlertsByAccident = async (accidentId) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/alerts/${accidentId}`,
    {
      method: "GET",
      headers,
    }
  );

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to fetch alerts");

  return data;
};
