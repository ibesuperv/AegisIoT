import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { db } from "../../constants/firebase";
import { onValue, ref } from "firebase/database";
import { Image } from "expo-image";
import styles from "../../assets/styles/home.styles";
import { useAuthStore } from "../../store/authStore";

export default function Index() {
  const { user, isCheckingAuth } = useAuthStore();
  const [statusData, setStatusData] = useState(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  /* ---------------- Firebase subscription (DIRECT – unchanged pattern) ---------------- */
  useEffect(() => {
    if (!user || !user.email || isCheckingAuth) return;

    const emailKey = user.email.replace(/\./g, "_");
    const userRef = ref(db, `user/${emailKey}`);

    console.log("📡 Listening Firebase path:", `user/${emailKey}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log("🔥 Firebase snapshot:", data);

      setStatusData(data || null);
    });

    return () => unsubscribe();
  }, [user, isCheckingAuth]);

  /* ---------------- Pulse animation ---------------- */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!user || !statusData) return null;

  /* ---------------- Safe field extraction ---------------- */
  const {
    accident = false,
    drowsy = false,
    lat = null,
    lng = null,
    headlight = false,
    tilt_angle = null,
    ldr = null,
    ir = null,
    smsSent = false,
  } = statusData;

  const locationUrl =
    lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : null;

  /* ---------------- UI ---------------- */
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❤️ SaViour 🚑</Text>
        <Text style={styles.headerSubtitle}>Monitoring saves a life</Text>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: user.profile_image }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user.username}</Text>

        {/* -------- Status Boxes -------- */}
        <View style={styles.statusBoxContainer}>
          {accident ? (
            <Animated.View
              style={[
                styles.statusBox,
                {
                  backgroundColor: "#ffcccc",
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={styles.statusText}>🚨 Accident Detected</Text>
            </Animated.View>
          ) : (
            <View style={[styles.statusBox, { backgroundColor: "#e8f5e9" }]}>
              <Text style={styles.statusText}>✅ No Accident</Text>
            </View>
          )}

          {drowsy ? (
            <Animated.View
              style={[
                styles.statusBox,
                {
                  backgroundColor: "#fff3cd",
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={styles.statusText}>😴 Drowsiness Detected</Text>
            </Animated.View>
          ) : (
            <View style={[styles.statusBox, { backgroundColor: "#e8f5e9" }]}>
              <Text style={styles.statusText}>✅ Awake</Text>
            </View>
          )}
        </View>

        {/* -------- Sensor Info -------- */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.statusText}>
            💡 Headlight: {headlight ? "ON" : "OFF"}
          </Text>
          <Text style={styles.statusText}>
            📐 Tilt Angle: {tilt_angle ?? "N/A"}°
          </Text>
          <Text style={styles.statusText}>
            🌞 LDR: {ldr ?? "N/A"}
          </Text>
          <Text style={styles.statusText}>
            👁️ IR Sensor: {ir ?? "N/A"}
          </Text>
          <Text style={styles.statusText}>
            📩 SMS Sent: {smsSent ? "Yes" : "No"}
          </Text>
        </View>

        {/* -------- Location -------- */}
        {locationUrl && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => Linking.openURL(locationUrl)}
          >
            <Text style={styles.locationButtonText}>📍 View Location</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
