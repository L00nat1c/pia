import { Text, View } from "react-native";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function Activity() {
  useEffect(() => {
    const checkAuth = async () => {
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
      <Text>Activity Screen</Text>
    </View>
  );
}
