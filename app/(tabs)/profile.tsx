import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/assets/components/BackButton";
import { useProfile } from "@/assets/context/ProfileContext";
import { useTheme } from "@/assets/context/ThemeContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { name, email, phone, address, setProfileData, orders } = useProfile();
  const { colors } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fadeAnim = new Animated.Value(1);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleFieldEdit = (field: string, value: string) => {
    setCurrentField(field);
    setInputValue(value);
    setModalVisible(true);
  };

  const handleSave = () => {
    setProfileData({
      ...{ name, email, phone, address },
      [currentField]: inputValue,
    });
    setModalVisible(false);
  };

  const onBackPress = () => router.back();
  const goToSettings = () => router.push("/Setting");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <BackButton onPress={onBackPress} />
        <TouchableOpacity onPress={goToSettings}>
          <Ionicons name="settings-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/profile_pic.jpg")}
          style={[styles.profileImage, { borderColor: colors.primary }]}
        />
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text
          style={[styles.email, { color: colors.text, opacity: 0.6 }]}
        >
          {email}
        </Text>

        <TouchableOpacity
          onPress={handleEditToggle}
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
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.detailsContainer}>
          {[ 
            { label: "Full Name", value: name, key: "name" },
            { label: "Email Address", value: email, key: "email" },
            { label: "Phone Number", value: phone, key: "phone" },
            { label: "Address", value: address, key: "address" },
          ].map((field) => (
            <TouchableOpacity
              key={field.key}
              style={[
                styles.inputGroup,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() =>
                isEditing && handleFieldEdit(field.key, field.value)
              }
              disabled={!isEditing}
            >
              <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
                {field.label}
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={[styles.value, { color: colors.text }]}>
                  {field.value}
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
          ))}

          {/* Recent Orders */}
          <View style={styles.orderSection}>
            <Text style={[styles.orderHeader, { color: colors.text }]}>
              Recent Orders
            </Text>
            {orders.length === 0 ? (
              <Text style={[styles.noOrders, { color: colors.text, opacity: 0.6 }]}>
                No orders yet.
              </Text>
            ) : (
              orders.map((order) => (
                <View
                  key={order.id}
                  style={[
                    styles.orderItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.orderText, { color: colors.text }]}>
                    {order.deliveryOption} — €
                  </Text>
                  <Text
                    style={[styles.orderDate, { color: colors.text, opacity: 0.7 }]}
                  >
                    {order.date}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Modal for Editing */}
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
  orderSection: { marginTop: 30 },
  orderHeader: { fontSize: 18, fontWeight: "700" },
  noOrders: { fontSize: 14 },
  orderItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  orderText: { fontSize: 16 },
  orderDate: { fontSize: 12 },
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
