import { View, Text } from "react-native";
import React from "react";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles";
import { Image } from "expo-image";
import { formatMemberSince } from "../lib/utils";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={{ width: 100, height: 100, borderRadius: 50, marginRight:20 }} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          🗓️Joined {formatMemberSince(user.createdAt)}
        </Text>
      </View>
    </View>
  );
}
