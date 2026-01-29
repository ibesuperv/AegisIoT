// app/(tabs)/profile.jsx
import { View, Text } from "react-native";
import React from "react";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import Update from "../../components/Update";

const Profile = () => {
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.Header}>
        <Text style={styles.Title}>Edit Your Profile ✏️</Text>
      </View>

      <Update />
    </View>
  );
};

export default Profile;
