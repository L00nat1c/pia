import { Text, View } from "react-native";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { AUTHENTICATION_ENABLED } from "../config";

export default function Discover() {
  useEffect(() => {
    const checkAuth = async () => {
      if (!AUTHENTICATION_ENABLED) {
        // Skip authentication check in development mode
        return;
      }

      const token = await SecureStore.getItemAsync("token");

      if (token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Discover Screen</Text>
    </View>
  );
}
