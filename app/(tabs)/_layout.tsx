import React from "react";
import { Tabs } from "expo-router";
import { View, Image, Text, StyleSheet } from "react-native";
import { useCart } from "@/assets/context/CartContect";
import { useTheme } from "@/assets/context/ThemeContext"; // ✅ assuming your theme context is here

export default function TabLayout() {
  const { cartItems } = useCart();
  const { theme, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBarBase,
          {
            backgroundColor: colors.background,
            borderTopColor: theme === "light" ? "#C4C4C4" : "#333",
            shadowColor: theme === "light" ? "#A259FF" : "#6C63FF",
          },
        ],
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/images/home-active.png")
                  : require("@/assets/images/home.png")
              }
              style={[styles.icon, { tintColor: focused ? "#A259FF" : "#A9A9A9" }]}
            />
          ),
        }}
      />

      {/* Cart Tab */}
      <Tabs.Screen
        name="(cart)"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.cartContainer}>
              <Image
                source={
                  focused
                    ? require("@/assets/images/cart-active.png")
                    : require("@/assets/images/shopping-cart.png")
                }
                style={[styles.icon, { tintColor: focused ? "#A259FF" : "#A9A9A9" }]}
              />

              {/* Badge */}
              {cartItems.length > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {cartItems.length > 9 ? "9+" : cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/images/user.png")
                  : require("@/assets/images/user.png")
              }
              style={[styles.icon, { tintColor: focused ? "#A259FF" : "#A9A9A9" }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBase: {
    height: 60,
    borderTopWidth: 2,
    borderTopColor: "#A259FF",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10, // ✅ remove extra top padding
    paddingBottom: 0, // ✅ remove extra bottom padding
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    alignSelf: "center",
  },
  cartContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#C6FF00",
    borderRadius: 15,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: "#5B009E",
    fontSize: 12,
    fontWeight: "bold",
  },
});

