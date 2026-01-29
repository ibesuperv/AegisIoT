// app/(auth)/signup.tsx
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { isLoading, register } = useAuthStore();

  const handleSignup = async () => {
    if (!username || !email || !password || !mobile || !contact1 || !contact2) {
      return Alert.alert("Error", "All fields are required");
    }

    const result = await register(
      username,
      email,
      password,
      mobile,
      contact1,
      contact2
    );

    if (!result.success) {
      Alert.alert("Error", result.error);
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>❤️ SaViour 🚑</Text>
              <Text style={styles.subtitle}>Monitor and Save a life</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Username */}
              <TextInputField
                label="User Name"
                icon="person-outline"
                value={username}
                onChangeText={setUsername}
              />

              {/* Email */}
              <TextInputField
                label="Email"
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              {/* Password */}
              <PasswordInput
                value={password}
                onChangeText={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              {/* Mobile */}
              <TextInputField
                label="Mobile Number"
                icon="call-outline"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />

              {/* Contact 1 */}
              <TextInputField
                label="Emergency Contact 1"
                icon="people-outline"
                value={contact1}
                onChangeText={setContact1}
                keyboardType="phone-pad"
              />

              {/* Contact 2 */}
              <TextInputField
                label="Emergency Contact 2"
                icon="people-outline"
                value={contact2}
                onChangeText={setContact2}
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.link}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Small reusable inputs (keeps UI same) ---------- */
const TextInputField = ({
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

const PasswordInput = ({
  value,
  onChangeText,
  showPassword,
  setShowPassword,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Password</Text>
    <View style={styles.inputContainer}>
      <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Ionicons
          name={showPassword ? "eye-outline" : "eye-off-outline"}
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  </View>
);
