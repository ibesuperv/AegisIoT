import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Fullscreen layout
  fullScreenContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // Large profile image display
  largeImageWrapper: {
    marginTop: 10,
    marginBottom: 16,
    borderRadius: width * 0.5,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  largeProfileImage: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "cover",
  },

  username: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },

  statusBoxContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 24,
  },
  statusBox: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
  },

  locationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default styles;
