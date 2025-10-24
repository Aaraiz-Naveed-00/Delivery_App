import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Main home screen */}
      <Stack.Screen name="CategoryDetail" />
    </Stack>
  );
}