import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import BackButton from "@/assets/components/BackButton";
import { useTheme } from "@/assets/context/ThemeContext"; // ✅ Import theme hook
import { router } from "expo-router"; // ✅ For proper back navigation

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme(); // ✅ Access global theme

  const onBackPress = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

