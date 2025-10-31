import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/assets/context/ThemeContext";
import { router } from "expo-router";
import { auth, db } from "@/backend/config/firebaseConfig";
import { ref, get, update } from "firebase/database";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";
import BackButton from "@/assets/components/BackButton";
import { updateProfile } from "firebase/auth";

// ✅ Cloudinary credentials
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duqffmi9a/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Delivery_App";

// ✅ Define User type
interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

export default function ProfileScreen() {
  const { colors } = useTheme();

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentField, setCurrentField] = useState<keyof UserData | "">("");

  const user = auth.currentUser;
  const userId = user?.uid;

  // ✅ Fetch data from Firebase Auth + Realtime DB
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        const dbData = snapshot.exists() ? snapshot.val() : {};

        setUserData({
          name: user?.displayName || dbData.name || "User",
          email: user?.email || dbData.email || "",
          phone: dbData.phone || "",
          address: dbData.address || "",
          profileImage: user?.photoURL || dbData.profileImage || "",
        });
      }
    };

    fetchUserData();
  }, [userId]);

  // ✅ Handle profile field editing
  const handleFieldEdit = (field: keyof UserData, value: string) => {
    setCurrentField(field);
    setInputValue(value);
    setModalVisible(true);
  };

  // ✅ Save profile field update
  const handleSave = async () => {
    if (!userId || !currentField) return;

    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { [currentField]: inputValue });

      if (currentField === "name" && user) {
        await updateProfile(user, { displayName: inputValue });
      }

      setUserData((prev) => ({ ...prev, [currentField]: inputValue }));
      setModalVisible(false);

      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
      });
    }
  };

  // ✅ Upload and crop profile image to Cloudinary
  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({ type: "error", text1: "Permission required" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const cropped = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append("file", {
        uri: cropped.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const response = await res.json();

      if (response.secure_url) {
        const imageUrl = response.secure_url;
        await update(ref(db, `users/${userId}`), { profileImage: imageUrl });
        if (user) await updateProfile(user, { photoURL: imageUrl });

        setUserData((prev) => ({ ...prev, profileImage: imageUrl }));

        Toast.show({
          type: "success",
          text1: "Profile picture updated!",
        });
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Row */}
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <TouchableOpacity onPress={() => router.push("/Setting")}>
          <Ionicons name="settings-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={
              userData.profileImage
                ? { uri: userData.profileImage }
                : require("@/assets/images/profile_pic.jpg")
            }
            style={[styles.profileImage, { borderColor: colors.primary }]}
          />
        </TouchableOpacity>

        <Text style={[styles.name, { color: colors.text }]}>{userData.name}</Text>
        <Text style={[styles.email, { color: colors.text, opacity: 0.6 }]}>
          {userData.email}
        </Text>

        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={[styles.editButton, { borderColor: colors.primary }]}
        >
          <Ionicons
            name={isEditing ? "checkmark-done" : "create-outline"}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.editText, { color: colors.primary }]}>
            {isEditing ? "Done" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Details */}
      <ScrollView style={styles.detailsContainer}>
        {(Object.keys(userData) as (keyof UserData)[]).map((field) =>
          field !== "profileImage" ? (
            <TouchableOpacity
              key={field}
              style={[
                styles.inputGroup,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => isEditing && handleFieldEdit(field, userData[field])}
              disabled={!isEditing}
            >
              <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={[styles.value, { color: colors.text }]}>
                  {userData[field] || "Not set"}
                </Text>
                {isEditing && (
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ) : null
        )}
      </ScrollView>

      {/* Floating Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit {currentField}
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              multiline={currentField === "address"}
              placeholderTextColor={colors.text + "80"}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 60 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 40,
  },
  header: { alignItems: "center", marginTop: 20 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 3,
  },
  name: { fontSize: 22, fontWeight: "700", marginTop: 10 },
  email: { fontSize: 14, marginBottom: 10 },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editText: { fontWeight: "600", marginLeft: 6 },
  detailsContainer: { marginTop: 20, paddingHorizontal: 20 },
  inputGroup: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  label: { fontSize: 14, marginBottom: 4 },
  value: { fontSize: 16 },
  fieldContainer: { flexDirection: "row", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 16,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalInput: {
    borderRadius: 10,
    padding: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
});
