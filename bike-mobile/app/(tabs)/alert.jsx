import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import profileStyles from "../../assets/styles/profile.styles";
import COLORS from "../../constants/colors";
import { getAlerts } from "../../lib/alerts";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadAlerts = async () => {
      try {
        const data = await getAlerts();
        if (mounted) setAlerts(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAlerts();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <View style={profileStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <View style={profileStyles.container}>
        <Text style={{ color: "red", textAlign: "center" }}>
          {error}
        </Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <View style={profileStyles.container}>
      <Text style={profileStyles.Title}>🚨 Alert History</Text>

      {alerts.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            color: COLORS.textSecondary,
            marginTop: 20,
          }}
        >
          No alerts recorded yet.
        </Text>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.alert_id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: COLORS.cardBackground,
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: COLORS.border,
                shadowColor: COLORS.black,
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 6,
                  color: COLORS.textPrimary,
                }}
              >
                {item.alert_type} Alert
              </Text>

              <Text style={{ color: COLORS.textSecondary }}>
                Recipient: {item.recipient}
              </Text>

              <Text style={{ color: COLORS.textSecondary }}>
                Status: {item.status}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}
              >
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
