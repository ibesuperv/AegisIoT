import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../lib/vehicles";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!vehicleNumber || !vehicleType) {
      return Alert.alert("Validation", "All fields are required");
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateVehicle(editingId, {
          vehicle_number: vehicleNumber,
          vehicle_type: vehicleType,
        });
      } else {
        await addVehicle(vehicleNumber, vehicleType);
      }

      setVehicleNumber("");
      setVehicleType("");
      setEditingId(null);
      loadVehicles();
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setVehicleNumber(item.vehicle_number);
    setVehicleType(item.vehicle_type);
    setEditingId(item.vehicle_id);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Vehicle", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteVehicle(id);
          loadVehicles();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.vehicle_id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* -------- FORM CARD -------- */}
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>🚲 Vehicles</Text>
                <Text style={styles.subtitle}>
                  Add and manage your vehicles
                </Text>
              </View>

              <View style={styles.formContainer}>
                <InputField
                  label="Vehicle Number"
                  icon="car-outline"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                />

                <InputField
                  label="Vehicle Type"
                  icon="pricetag-outline"
                  value={vehicleType}
                  onChangeText={setVehicleType}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleAddOrUpdate}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {editingId ? "Update Vehicle" : "Add Vehicle"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* -------- LIST HEADER -------- */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.textPrimary,
                marginTop: 24,
                marginBottom: 12,
              }}
            >
              Your Vehicles
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <Text
              style={[
                styles.footerText,
                { textAlign: "center", marginTop: 20 },
              ]}
            >
              No vehicles added yet.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.cardBackground,
              marginHorizontal: 20,
              marginBottom: 14,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              shadowColor: COLORS.black,
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {/* Vehicle info */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="car-sport-outline"
                size={26}
                color={COLORS.primary}
                style={{ marginRight: 10 }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: COLORS.textPrimary,
                  }}
                >
                  {item.vehicle_number}
                </Text>
                <Text style={{ color: COLORS.textSecondary }}>
                  {item.vehicle_type}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={{ marginRight: 20 }}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.vehicle_id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

/* ---------- Reusable Input ---------- */
const InputField = ({
  label,
  icon,
  value,
  onChangeText,
  keyboardType = "default",
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);
