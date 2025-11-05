import { CartProvider } from "@/assets/context/CartContect";
import { ProfileProvider } from "@/assets/context/ProfileContext";
import { ThemeProvider } from "../assets/context/ThemeContext";

import Constants from "expo-constants";
import * as Device from "expo-device";
import type { EventSubscription } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

// ✅ Firebase imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import app from "../backend/config/firebaseConfig"; // adjust path to your firebaseConfig

// ✅ Configure notification behavior when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth(app);
  const db = getDatabase(app);

  // 🔹 Monitor logged-in user to know where to save token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);

  // 🧭 Register for push notifications
  async function registerForPushNotificationsAsync() {
    let token: string | undefined;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission Denied", "Failed to get push token for notifications.");
        return;
      }

      // ✅ Expo project ID from app config
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        "YOUR_PROJECT_ID"; // fallback for dev

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
      setExpoPushToken(token);
    } else {
      Alert.alert("Physical Device Required", "Push notifications only work on real devices.");
    }

    // ✅ Android channel setup
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  // 🔔 Register and add listeners
  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // 💾 Save token to Firebase when both token and user are available
  useEffect(() => {
    if (expoPushToken && userId) {
      const userRef = ref(db, `users/${userId}`);
      update(userRef, { expoPushToken })
        .then(() => console.log("✅ Expo Push Token saved to Firebase"))
        .catch((error) => console.error("❌ Failed to save token:", error));
    }
  }, [expoPushToken, userId]);

  return (
    <CartProvider>
      <ProfileProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="PaymentMethod" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </ProfileProvider>
    </CartProvider>
  );
}
