import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Main cart screen */}
      <Stack.Screen name="Checkout" />
      <Stack.Screen name="PaymentMethod" />
    </Stack>
  );
}
