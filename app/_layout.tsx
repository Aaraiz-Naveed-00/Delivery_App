import React, { useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../assets/context/ThemeContext";
import { CartProvider } from "@/assets/context/CartContect";
import { ProfileProvider } from "@/assets/context/ProfileContext";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";
import type { EventSubscription } from "expo-notifications";

// ✅ Configure how notifications behave when app is foreground
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
  // ✅ Define inside component
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);
  const [expoPushToken, setExpoPushToken] = useState("");

  // 🧭 Register for push notifications
  async function registerForPushNotificationsAsync() {
    let token;

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

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? "YOUR_PROJECT_ID"; // fallback

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
      setExpoPushToken(token);
    } else {
      Alert.alert("Physical Device Required", "Push notifications only work on real devices.");
    }

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

  // 🔔 Run registration and listeners when app loads
  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
    });

    return () => {
      // ✅ Safe cleanup
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

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
