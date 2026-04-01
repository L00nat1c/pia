import { Stack, router, usePathname } from "expo-router";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import CustomHeader from "./components/CustomHeader";
import { AUTHENTICATION_ENABLED } from "@/app/config";

// This is the root layout file that wraps everything. Also displays header.

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    const guardRoute = async () => {
      if (!AUTHENTICATION_ENABLED) {
        return;
      }

      const token = await SecureStore.getItemAsync("token");
      const inAuthFlow = pathname === "/login" || pathname === "/register";

      if (!token && !inAuthFlow) {
        router.replace("/(auth)/login");
        return;
      }

      if (token && inAuthFlow) {
        router.replace("/(tabs)");
      }
    };

    guardRoute();
  }, [pathname]);

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
