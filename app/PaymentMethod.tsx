import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import TextRecognition from "react-native-text-recognition";
import BackButton from "@/assets/components/BackButton";
import MyButton from "@/assets/components/MyButton";
import { useTheme } from "@/assets/context/ThemeContext"; // ✅ Import custom theme

export default function PaymentMethod() {
  const { theme, colors } = useTheme(); // ✅ Access theme and colors

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [selectedCard, setSelectedCard] = useState<
    "visa" | "mastercard" | "paypal"
  >("visa");
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // 📸 Request camera permission
  const handleScanPress = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Camera permission is required to scan your card.");
        return;
      }
    }
    setCameraVisible(true);
  };

  // 🧠 Capture image and extract card details
  const handleCapture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const blocks = await TextRecognition.recognize(imageUri);
      const allText = blocks.join(" ");

      const cardMatch = allText.match(/\b(?:\d[ -]*?){13,16}\b/);
      const expiryMatch = allText.match(/(0[1-9]|1[0-2])\/?([0-9]{2})/);
      const nameMatch = allText.match(/[A-Z]+\s+[A-Z]+/);

      if (cardMatch) setCardNumber(cardMatch[0].replace(/ /g, ""));
      if (expiryMatch) setExpiry(expiryMatch[0]);
      if (nameMatch) setName(nameMatch[0]);

      alert("✅ Card details extracted successfully!");
    }

    setCameraVisible(false);
  };

  // Auto-format card number
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D+/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  // Auto-format expiry (MM/YY)
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D+/g, "");
    if (cleaned.length <= 2) {
      setExpiry(cleaned);
    } else {
      setExpiry(cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4));
    }
  };

  const addCard = () => {
    if (!name || !cardNumber || !expiry || !cvc) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all fields before continuing."
      );
      return;
    }

    router.push({
      pathname: "/Checkout",
      params: {
        selectedPayment: `**** **** **** ${cardNumber.slice(-4)}`,
      },
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      {/* Title */}
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Credit / Debit Card
      </Text>

      {/* Card Preview */}
      <View style={styles.cardContainer}>
        <Image
          source={require("@/assets/images/card.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      {/* Camera Button */}
      <View style={styles.cameraButtonContainer}>
        <TouchableOpacity style={styles.cameraButton} onPress={handleScanPress}>
          <Image
            source={require("@/assets/images/Take_photo.png")}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name */}
        <Text style={[styles.label, { color: colors.text }]}>Name on card</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Alexandra Smith"
          placeholderTextColor={theme === "dark" ? "#777" : "#A7A7A7"}
          value={name}
          onChangeText={setName}
        />

        {/* Card Number */}
        <Text style={[styles.label, { color: colors.text }]}>Card number</Text>
        <View style={styles.cardRow}>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="4747 4747 4747 4747"
            placeholderTextColor={theme === "dark" ? "#777" : "#A7A7A7"}
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            maxLength={19}
          />

          {/* Card Type Selector */}
          <View style={styles.cardSelector}>
            {["visa", "mastercard", "paypal"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedCard(type as any)}
              >
                <Image
                  source={
                    type === "visa"
                      ? require("@/assets/images/visa.png")
                      : type === "mastercard"
                      ? require("@/assets/images/mastercard.png")
                      : require("@/assets/images/paypal.png")
                  }
                  style={[
                    styles.cardIcon,
                    selectedCard === type && styles.activeIcon,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Expiry and CVC */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { marginRight: 10 }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Expiry date
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="MM/YY"
              placeholderTextColor={theme === "dark" ? "#777" : "#A7A7A7"}
              keyboardType="numeric"
              value={expiry}
              onChangeText={handleExpiryChange}
              maxLength={5}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>CVC</Text>
            <View
              style={[
                styles.cvcField,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, styles.cvcInput, { color: colors.text }]}
                placeholder="***"
                placeholderTextColor={theme === "dark" ? "#777" : "#A7A7A7"}
                secureTextEntry
                keyboardType="numeric"
                value={cvc}
                onChangeText={setCvc}
                maxLength={3}
              />
              <Image
                source={require("@/assets/images/Hint.png")}
                style={styles.cvcIconInside}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Use Card Button */}
      <MyButton title={"USE THIS CARD"} onPress={addCard} />

      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide">
        <CameraView style={{ flex: 1 }} facing="back" />
        <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
          <Text style={styles.captureText}>📸 Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCameraVisible(false)}
          style={styles.cancelCameraBtn}
        >
          <Text style={styles.cancelCameraText}>Cancel</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "left",
    marginLeft: 10,
  },
  cardContainer: {
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: 300,
    marginHorizontal: 10,
  },
  cameraButtonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  cameraButton: {
    paddingVertical: 10,
  },
  cameraIcon: {
    width: 32,
    height: 32,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexInput: {
    flex: 1,
    marginBottom: 0,
  },
  cardSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  cardIcon: {
    width: 35,
    height: 22,
    opacity: 0.4,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    flex: 1,
  },
  cvcField: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
  },
  cvcInput: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
  },
  cvcIconInside: {
    width: 24,
    height: 18,
    marginRight: 12,
    opacity: 0.7,
  },
  captureButton: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "#7B3EFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  captureText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelCameraBtn: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#00000088",
    padding: 12,
    borderRadius: 8,
  },
  cancelCameraText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
