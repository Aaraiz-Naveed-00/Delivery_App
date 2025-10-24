import { Stack } from "expo-router";
import { ThemeProvider } from "../assets/context/ThemeContext";
import { CartProvider } from "@/assets/context/CartContect";
import { ProfileProvider } from "@/assets/context/ProfileContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <ProfileProvider>
    <ThemeProvider>
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash screen (Order Now) */}
      <Stack.Screen name="index" />
      {/* Tabs layout (shown after Order Now) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="PaymentMethod" options={{ headerShown: false }}  />
    </Stack>
    </ThemeProvider>
    </ProfileProvider>
    </CartProvider>
  );
}