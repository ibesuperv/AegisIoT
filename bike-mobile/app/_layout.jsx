// app/_layout.jsx
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
  SplashScreen,
} from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { registerForPushNotificationsAsync } from "../constants/notification";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMonoNL-Medium": require("../assets/fonts/JetBrainsMonoNL-Medium.ttf"),
  });

  /* Fonts */
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  /* Auth init */
  useEffect(() => {
    checkAuth();
  }, []);

  /* Push notifications */
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  /* Route protection */
  useEffect(() => {
    if (!navigationState?.key || isCheckingAuth) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isLoggedIn = Boolean(user && token);

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [segments, user, token, navigationState, isCheckingAuth]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
