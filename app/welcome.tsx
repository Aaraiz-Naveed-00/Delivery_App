import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import MyButton from "../assets/components/MyButton";
import { router } from "expo-router";
import { useTheme } from "../assets/context/ThemeContext"; // ✅ Import Theme Context



const { width, height } = Dimensions.get("window");

export default function Index() {
  
  const { theme, colors } = useTheme(); // ✅ Access theme and color palette

  const onOrderClick = () => {
    router.replace("/(tabs)/(home)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={
          theme === "dark"
            ? require("../assets/images/background-dark.png")
            : require("../assets/images/background.png")
        }
        resizeMode="cover"
        style={styles.background}
      >
        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

        {/* Bottom Card Section */}
        <View
          style={[
            styles.subcontainer,
            { backgroundColor: theme === "dark" ? colors.card : "#F6F5F5" },
          ]}
        >
          <View
            style={[
              styles.round_container,
              {
                backgroundColor: theme === "dark" ? "#2C2C2E" : "#FFFFFF",
              },
            ]}
          >
            <Image
              source={
                theme === "dark"
                  ? require("../assets/images/cube-dark.png")
                  : require("../assets/images/cube.png")
              }
              style={styles.box}
            />
          </View>

          <Text style={[styles.mainText, { color: colors.text }]}>
            Non-Contact{"\n"}
            <Text style={{ color: colors.primary }}>Deliveries</Text>
          </Text>

          <Text style={[styles.Paragraph, { color: theme === "dark" ? "#A1A1AA" : "#9586A8" }]}>
            When placing an order, select the option {"\n"}
            "Contactless delivery" and the courier will leave {"\n"}
            your order at the door.
          </Text>

          <MyButton title="ORDER NOW" onPress={onOrderClick} />

          <TouchableOpacity
            style={styles.dismiss}
            onPress={() => router.replace("/(tabs)/(home)")}
          >
            <Text style={[styles.dismissText, { color: theme === "dark" ? "#A1A1AA" : "#9586A8" }]}>
              DISMISS
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  subcontainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: height * 0.68,
    borderTopRightRadius: width * 0.1,
    borderTopLeftRadius: width * 0.1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.04,
  },
  logo: {
    width: width * 0.22,
    height: width * 0.22,
    marginBottom: height * 0.18,
    marginLeft: width * 0.02,
    alignSelf: "flex-start",
  },
  round_container: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.025,
  },
  box: {
    width: width * 0.12,
    height: width * 0.12,
    marginRight: 3,
    resizeMode: "contain",
  },
  mainText: {
    textAlign: "center",
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginVertical: height * 0.02,
    fontFamily: "sans-serif",
  },
  Paragraph: {
    textAlign: "center",
    fontSize: width * 0.042,
    marginBottom: height * 0.05,
    lineHeight: height * 0.025,
  },
  dismiss: {
    paddingVertical: height * 0.015,
    alignItems: "center",
    width: "100%",
  },
  dismissText: {
    fontWeight: "500",
    fontSize: width * 0.045,
  },
});
