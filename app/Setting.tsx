import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import BackButton from "@/assets/components/BackButton";
import { useTheme } from "@/assets/context/ThemeContext";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "@/backend/config/firebaseConfig"; // ✅ Your Firebase config file

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();

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
