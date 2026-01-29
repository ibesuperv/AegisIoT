import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import styles from "../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useAuthStore } from "../store/authStore";
import { useFocusEffect } from "@react-navigation/native";

const Update = () => {
  const {
    user,
    updateProfile,
    updateContacts,
    fetchProfile,
    isLoading,
  } = useAuthStore();

  const [editingField, setEditingField] = useState(null);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");

  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const contact1Ref = useRef(null);
  const contact2Ref = useRef(null);

  /* ---------------- Load data on focus ---------------- */
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setUsername(user.username || "");
        setMobile(user.mobile?.replace("+91", "") || "");
        setContact1(
          user.EmergencyContact?.contact1?.replace("+91", "") || ""
        );
        setContact2(
          user.EmergencyContact?.contact2?.replace("+91", "") || ""
        );
      }
      setEditingField(null);
    }, [user])
  );

  /* ---------------- Helpers ---------------- */
  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  const hasChanges = () =>
    username !== user?.username ||
    mobile !== user?.mobile?.replace("+91", "") ||
    contact1 !== user?.EmergencyContact?.contact1?.replace("+91", "") ||
    contact2 !== user?.EmergencyContact?.contact2?.replace("+91", "");

  const handleEdit = (field) => {
    setEditingField(field);
    setTimeout(() => {
      if (field === "name") nameRef.current?.focus();
      if (field === "mobile") mobileRef.current?.focus();
      if (field === "contact1") contact1Ref.current?.focus();
      if (field === "contact2") contact2Ref.current?.focus();
    }, 100);
  };

  const handleCancelEdit = () => {
    if (!user) return;
    setUsername(user.username || "");
    setMobile(user.mobile?.replace("+91", "") || "");
    setContact1(
      user.EmergencyContact?.contact1?.replace("+91", "") || ""
    );
    setContact2(
      user.EmergencyContact?.contact2?.replace("+91", "") || ""
    );
    setEditingField(null);
  };

  /* ---------------- Save ---------------- */
  const handleSaveChanges = () => {
    if (mobile && !isValidPhone(mobile)) {
      return Alert.alert("Invalid Mobile", "Enter a valid 10-digit mobile number");
    }
    if (contact1 && !isValidPhone(contact1)) {
      return Alert.alert("Invalid Contact", "Contact 1 is invalid");
    }
    if (contact2 && !isValidPhone(contact2)) {
      return Alert.alert("Invalid Contact", "Contact 2 is invalid");
    }

    Alert.alert("Confirm Update", "Update your profile details?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            if (
              username !== user?.username ||
              mobile !== user?.mobile?.replace("+91", "")
            ) {
              await updateProfile(username, mobile);
            }

            if (
              contact1 !==
                user?.EmergencyContact?.contact1?.replace("+91", "") ||
              contact2 !==
                user?.EmergencyContact?.contact2?.replace("+91", "")
            ) {
              await updateContacts(contact1, contact2);
            }

            await fetchProfile();
            setEditingField(null);
            Keyboard.dismiss();
            Alert.alert("Success", "Profile updated successfully");
          } catch (err) {
            Alert.alert("Update Failed", err.message);
          }
        },
      },
    ]);
  };

  /* ---------------- Render Field ---------------- */
  const renderField = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    refObj,
    fieldKey,
    keyboardType = "default",
  }) => {
    const isEditing = editingField === fieldKey;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isEditing
                ? COLORS.inputBackground
                : "#f0f0f0",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            ref={refObj}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            editable={isEditing}
            onBlur={() => setEditingField(null)}
            style={styles.input}
            keyboardType={keyboardType}
          />
          <TouchableOpacity
            onPress={() =>
              isEditing ? handleCancelEdit() : handleEdit(fieldKey)
            }
          >
            <Ionicons
              name={isEditing ? "close-outline" : "pencil-outline"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {renderField({
                  label: "User Name",
                  icon: "person-outline",
                  value: username,
                  onChangeText: setUsername,
                  placeholder: user?.username || "",
                  refObj: nameRef,
                  fieldKey: "name",
                })}

                {renderField({
                  label: "Mobile Number",
                  icon: "call-outline",
                  value: mobile,
                  onChangeText: setMobile,
                  placeholder: "10 digit number",
                  refObj: mobileRef,
                  fieldKey: "mobile",
                  keyboardType: "phone-pad",
                })}

                {renderField({
                  label: "Emergency Contact 1",
                  icon: "people-outline",
                  value: contact1,
                  onChangeText: setContact1,
                  placeholder: "Contact 1",
                  refObj: contact1Ref,
                  fieldKey: "contact1",
                  keyboardType: "phone-pad",
                })}

                {renderField({
                  label: "Emergency Contact 2",
                  icon: "people-outline",
                  value: contact2,
                  onChangeText: setContact2,
                  placeholder: "Contact 2",
                  refObj: contact2Ref,
                  fieldKey: "contact2",
                  keyboardType: "phone-pad",
                })}

                <TouchableOpacity
                  style={[styles.button, { opacity: hasChanges() ? 1 : 0.5 }]}
                  disabled={!hasChanges()}
                  onPress={handleSaveChanges}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Update</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Update;
