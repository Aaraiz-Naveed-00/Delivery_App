import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  Image,
} from "react-native";
import { useTheme } from "@/assets/context/ThemeContext";
import { router } from "expo-router";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import LottieView from "lottie-react-native";
import { auth } from "@/backend/config/firebaseConfig";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

// ✅ Extract constants safely
const extra = Constants.expoConfig?.extra ?? {};
const EXPO_GOOGLE_CLIENT_ID =
  extra.EXPO_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_NOT_SET";
const EXPO_FACEBOOK_APP_ID =
  extra.EXPO_FACEBOOK_APP_ID || "FACEBOOK_APP_ID_NOT_SET";

// ✅ Redirect URI
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "deliveryapp",
});

const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

export default function Index() {
  const { colors, theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // ✅ Redirect if user already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/welcome");
    });
    return unsubscribe;
  }, []);

  // ✅ Google & Facebook Auth setup
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest({
    clientId: EXPO_GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri,
  });

  const [fbRequest, fbResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: EXPO_FACEBOOK_APP_ID,
    redirectUri,
  });

  // ✅ Handle responses
  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (googleResponse?.type === "success") {
        setLoading(true);
        try {
          const accessToken = googleResponse.authentication?.accessToken;
          if (!accessToken) throw new Error("Google token missing");
          const credential = GoogleAuthProvider.credential(null, accessToken);
          await signInWithCredential(auth, credential);
          showLoadingThenRedirect();
        } catch {
          showToast("Google login failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    const handleFacebookLogin = async () => {
      if (fbResponse?.type === "success") {
        setLoading(true);
        try {
          const { access_token } = fbResponse.params;
          if (!access_token) throw new Error("Facebook token missing");
          const credential = FacebookAuthProvider.credential(access_token);
          await signInWithCredential(auth, credential);
          showLoadingThenRedirect();
        } catch {
          showToast("Facebook login failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    handleGoogleLogin();
    handleFacebookLogin();
  }, [googleResponse, fbResponse]);

  // ✅ Show loader then redirect
  const showLoadingThenRedirect = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      router.replace("/welcome");
    }, 1500);
  };

  // ✅ Email login with validation
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      if (email === "admin@delivery.com" && password === "admin123") {
        showToast("Welcome Admin!");
        router.replace("/ProductAddingForm");
        return;
      }

      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      showLoadingThenRedirect();
    } catch {
      showToast("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Loader screen (Lottie)
  if (showLoader) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("@/assets/animations/Loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ color: "#fff", fontSize: 18, marginTop: 20 }}>
          Logging you in...
        </Text>
      </View>
    );
  }

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
          keyboardType="email-address"
          autoCapitalize="none"
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
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        {/* 🟢 Social Login */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
            onPress={() => promptGoogle()}
            disabled={!googleRequest || loading}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_%22G%22_Logo.svg",
              }}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
            onPress={() => promptFacebook()}
            disabled={!fbRequest || loading}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Register with Email
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ✅ Styles
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
  link: { textAlign: "center", marginTop: 25, fontSize: 15 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 20,
  },
  socialButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { width: 30, height: 30, borderRadius: 5 },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
