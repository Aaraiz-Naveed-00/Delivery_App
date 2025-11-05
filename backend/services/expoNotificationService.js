// services/expoNotificationService.js
import { get, getDatabase, ref } from "firebase/database";
import fetch from "node-fetch";
import { app } from "../config/firebaseConfig.js";

const db = getDatabase(app);

/**
 * Send Expo push notifications to all users who have expoPushToken saved.
 */
export const sendExpoNotificationToAllUsers = async (title, body) => {
  try {
    // ✅ Get all users from Realtime Database
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log("❌ No users found to send notifications");
      return;
    }

    // Collect valid Expo push tokens
    const tokens = Object.values(snapshot.val())
      .map((user) => user.expoPushToken)
      .filter((token) => token && token.startsWith("ExponentPushToken"));

    if (tokens.length === 0) {
      console.log("⚠️ No valid Expo tokens available");
      return;
    }

    console.log("📱 Sending notification to:", tokens.length, "devices");

    // ✅ Send batch request to Expo push API
    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title,
      body,
      data: { title, body },
    }));

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    console.log("✅ Expo notification response:", data);

    return data;
  } catch (error) {
    console.error("❌ Error sending Expo notification:", error);
    throw error;
  }
};
