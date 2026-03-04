import { Stack } from "expo-router";

// This is the root layout file that wraps everything. Also displays header.

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Play It Again",
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#232323" },
        headerTintColor: "#fff",
      }}
    />
  );
}
