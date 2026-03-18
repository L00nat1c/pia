import { Stack } from "expo-router";
import CustomHeader from "./components/CustomHeader";

// This is the root layout file that wraps everything. Also displays header.

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // headerTitle: "Play It Again",
        // headerTitleAlign: "left",
        // headerStyle: { backgroundColor: "#080808" },
        // headerTintColor: "#fff",
        header: () => <CustomHeader />, // Use the custom header
      }}
    />
  );
}
