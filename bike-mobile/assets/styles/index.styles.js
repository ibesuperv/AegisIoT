import { StyleSheet, Animated } from "react-native";
import COLORS from "../../constants/colors"

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  statusBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  statusBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  blinkingBox: {
    // Handled via animation in component
  },
  statusText: {
    color: COLORS.textDark,
    fontWeight: "600",
    fontSize: 14,
  },
  locationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  locationButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
