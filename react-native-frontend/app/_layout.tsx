import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import CustomHeader from "./components/CustomHeader";
// This is the root layout file that wraps everything. Also displays header.

function isValidStoredToken(token: string | null) {
  if (!token) {
    return false;
  }

  const normalized = token.replace(/^"+|"+$/g, "").trim();
  if (!normalized) {
    return false;
  }

  return normalized !== "null" && normalized !== "undefined";
}

export default function RootLayout() {
  const segments = useSegments();
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const guardRoute = async () => {
      const token = await SecureStore.getItemAsync("token");
      const hasValidToken = isValidStoredToken(token);
      const inAuthFlow = segments[0] === "(auth)";

      if (!hasValidToken && !inAuthFlow) {
        router.replace("/(auth)/login");
        setAuthResolved(true);
        return;
      }

      setAuthResolved(true);
    };

    guardRoute();
  }, [segments]);

  if (!authResolved) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
