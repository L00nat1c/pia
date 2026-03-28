import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthdate] = useState("");

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          birthDate,
        }),
      });

      const data = await res.text();

      if (!res.ok) {
        if (data.includes("username")) {
          Alert.alert("Error", "Username already taken");
        } else if (data.includes("email")) {
          Alert.alert("Error", "Email already in use");
        } else {
          Alert.alert("Error", "Registration failed");
        }
        return;
      }

      Alert.alert("Success", "Please Log in!");

      router.replace("/(auth)/login");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Birthdate (YYYY-MM-DD)"
        onChangeText={setBirthdate}
        value={birthDate}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#080808",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#958d80",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    color: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#c2410c",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  regButton: {
    backgroundColor: "#958d80",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
