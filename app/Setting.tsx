import BackButton from "@/assets/components/BackButton";
import { useTheme } from "@/assets/context/ThemeContext";
import { auth } from "@/backend/config/firebaseConfig"; // ✅ Your Firebase config file
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const [pushStatus, setPushStatus] = useState<string>("");
  const [expoToken, setExpoToken] = useState<string>("");

  // ✅ Back navigation
  const onBackPress = () => {
    router.back();
  };

  // ✅ Logout logic
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been signed out successfully.");
      router.replace("/"); // ✅ Go back to main entry (index.tsx)
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // ✅ Push notifications diagnostics
  const getProjectId = () =>
    (Constants?.expoConfig?.extra as any)?.eas?.projectId || "";

  const requestAndShowToken = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        setPushStatus("Permission not granted");
        return;
      }
      const projectId = getProjectId();
      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      setExpoToken(token);
      setPushStatus("Token acquired");
    } catch (e: any) {
      setPushStatus(`Token error: ${e?.message || e}`);
    }
  };

  const scheduleLocalTest = async () => {
    try {
      const trigger: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      };
      await Notifications.scheduleNotificationAsync({
        content: { title: "Test Notification", body: "Local notification works." },
        trigger,
      });
      Alert.alert("Scheduled", "Local notification scheduled in 2s");
    } catch (e: any) {
      Alert.alert("Error", e?.message || String(e));
    }
  };

  const sendExpoPushToSelf = async () => {
    try {
      if (!expoToken) {
        Alert.alert("No token", "Generate token first");
        return;
      }
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          { to: expoToken, sound: "default", title: "Expo Push Test", body: "Hello from client" },
        ]),
      });
      const json = await res.json();
      Alert.alert("Sent", JSON.stringify(json));
    } catch (e: any) {
      Alert.alert("Error", e?.message || String(e));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <BackButton onPress={onBackPress} />

      <Text style={[styles.title, { color: colors.text }]}>App Appearance</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme === "dark" ? "#fff" : "#0BCE83"}
          trackColor={{ false: "#ccc", true: "#0BCE83" }}
        />
      </View>

      {/* ✅ Spacer to leave room for bottom navigation */}
      <View style={{ flex: 1 }} />

      {/* ✅ Push notifications diagnostics */}
      <Text style={[styles.title, { color: colors.text }]}>Push Diagnostics</Text>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: "#7B3EFF" }]}
        onPress={requestAndShowToken}
      >
        <Text style={styles.logoutText}>Get Expo Push Token</Text>
      </TouchableOpacity>
      {!!expoToken && (
        <Text style={[{ color: colors.text, marginTop: 8 }]} numberOfLines={1}>
          {expoToken}
        </Text>
      )}
      {!!pushStatus && (
        <Text style={[{ color: colors.text, marginTop: 4 }]}>{pushStatus}</Text>
      )}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: "#00A884" }]}
        onPress={scheduleLocalTest}
      >
        <Text style={styles.logoutText}>Schedule Local Test</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: "#0BCE83" }]}
        onPress={sendExpoPushToSelf}
      >
        <Text style={styles.logoutText}>Send Expo Push To Self</Text>
      </TouchableOpacity>

      {/* ✅ Logout Button */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: theme === "dark" ? "#FF5C5C" : "#ff4d4d" },
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
