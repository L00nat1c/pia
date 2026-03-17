import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const API_URL = "http://192.168.68.126:8080";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
          router.replace("/(auth)/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.replace("/(auth)/login");
          return;
        }

        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldText}>Username: {userData?.username}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldText}>Email: {userData?.email}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldText}>Birth Date: {userData?.birthDate}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#080808",
  },
  fieldContainer: {
    marginVertical: 10,
  },
  fieldText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
