import { Platform } from "react-native";
import * as Device from "expo-device";

const API_URL =
  Platform.OS === "android" && Device.isDevice === false
    ? "http://10.0.2.2:3000"        // Android Emulator
    : "http://10.187.186.177:3000"; // Expo Go / physical device

export default API_URL;
