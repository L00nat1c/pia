import { Stack } from "expo-router";
import CustomHeader from "./components/CustomHeader";

// This is the root layout file that wraps everything. Also displays header.

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
}
