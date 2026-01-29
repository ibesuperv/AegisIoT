import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

import { db } from "../../constants/firebase";
import { ref, onValue } from "firebase/database";
import { useAuthStore } from "../../store/authStore";

import signupStyles from "../../assets/styles/signup.styles";
import profileStyles from "../../assets/styles/profile.styles";
import COLORS from "../../constants/colors";

export default function MapScreen() {
  const { user, isCheckingAuth } = useAuthStore();
  const [location, setLocation] = useState(null);

  /* ---------------- Firebase subscription (DIRECT) ---------------- */
  useEffect(() => {
    if (!user || !user.email || isCheckingAuth) return;

    const emailKey = user.email.replace(/\./g, "_");
    const userRef = ref(db, `user/${emailKey}`);

    console.log("📡 [Map] Listening Firebase path:", `user/${emailKey}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log("🔥 [Map] Firebase snapshot:", data);

      if (data?.lat && data?.lng) {
        setLocation({
          latitude: Number(data.lat),
          longitude: Number(data.lng),
        });
      }
    });

    return () => unsubscribe();
  }, [user, isCheckingAuth]);

  /* ---------------- Open Directions ---------------- */
  const handleGetDirections = () => {
    if (!location) return;

    const { latitude, longitude } = location;

    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open maps")
    );
  };

  /* ---------------- Loading ---------------- */
  if (isCheckingAuth || !location) {
    return (
      <View style={profileStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>
          Waiting for live location…
        </Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <View style={profileStyles.container}>
      {/* Header Card */}
      <View style={signupStyles.card}>
        <View style={signupStyles.header}>
          <Text style={signupStyles.title}>📍 Live Location</Text>
          <Text style={signupStyles.subtitle}>
            Real-time tracking from Firebase
          </Text>
        </View>

        {/* Map */}
        <View
          style={{
            height: 300,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.border,
            marginBottom: 16,
          }}
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              ...location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              ...location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={location}
              title="Tracked Location"
              description="Live position"
            />
          </MapView>
        </View>

        {/* Action */}
        <TouchableOpacity
          style={signupStyles.button}
          onPress={handleGetDirections}
        >
          <Text style={signupStyles.buttonText}>🧭 Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
