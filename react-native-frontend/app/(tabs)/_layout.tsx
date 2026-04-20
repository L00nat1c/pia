import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

// This file enables a sticky footer and that persists for navigation. The routes are the other .tsx file in this directory.

export default function TabLayout() {
  const [authResolved, setAuthResolved] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const resolveAuth = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      setToken(storedToken);
      setAuthResolved(true);
    };

    resolveAuth();
  }, []);

  if (!authResolved) {
    return null;
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#c2410c",
        tabBarInactiveTintColor: "#958d80",
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          backgroundColor: "#080808",
          borderTopColor: "#080808",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="review"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
