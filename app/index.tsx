import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "@/assets/context/ThemeContext";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/backend/config/firebaseConfig"; // ✅ Firebase auth import

export default function Index() {
  const { colors, theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // ✅ Hardcoded Admin Login
    if (email === "admin@delivery.com" && password === "admin123") {
      Alert.alert("Admin Login", "Welcome Admin!");
      router.replace("/ProductAddingForm");
      return;
    }

    // ✅ Normal User Login via Firebase
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login Successful!");
      router.replace("/welcome");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Welcome Back 👋</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Log in to continue shopping
      </Text>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Email"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Password"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "LOGIN"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Don’t have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  form: { width: "100%" },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { textAlign: "center", marginTop: 20, fontSize: 15 },
});
