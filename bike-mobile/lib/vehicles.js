// lib/vehicles.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../constants/api";

/* ---------------- Helper ---------------- */
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Authentication token missing");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ---------------- GET VEHICLES ---------------- */
export const getVehicles = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/vehicles`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch vehicles");

  return data;
};

/* ---------------- ADD VEHICLE ---------------- */
export const addVehicle = async (vehicle_number, vehicle_type) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/vehicles`, {
    method: "POST",
    headers,
    body: JSON.stringify({ vehicle_number, vehicle_type }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add vehicle");

  return data;
};

/* ---------------- UPDATE VEHICLE ---------------- */
export const updateVehicle = async (vehicleId, payload) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to update vehicle");

  return data;
};

/* ---------------- DELETE VEHICLE ---------------- */
export const deleteVehicle = async (vehicleId) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete vehicle");
  }

  return true;
};
