import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type LoginErrors = {
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleLogin = async () => {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email,
          password,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const token = await res.text(); // backend returns string

      // save token
      await SecureStore.setItemAsync("token", token);

      router.replace("/(tabs)");
    } catch (err) {
      console.log(err);

      if (err instanceof Error && err.message === "Invalid credentials") {
        setErrors({
          email: "Incorrect email or password.",
          password: "Incorrect email or password.",
        });
      } else {
        Alert.alert(
          "Error",
          "Login failed. Check that your phone can reach the backend server.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Welcome back to Play It Again</Text>

            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="#8f897d"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={(value) => {
                  setEmail(value);
                  setErrors((current) => ({ ...current, email: undefined }));
                }}
                value={email}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#8f897d"
                secureTextEntry
                textContentType="password"
                onChangeText={(value) => {
                  setPassword(value);
                  setErrors((current) => ({ ...current, password: undefined }));
                }}
                value={password}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.regButton}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#080808",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#111111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#232323",
    padding: 18,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  input: {
    width: "100%",
    height: 46,
    borderColor: "#5f594f",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#fff",
    backgroundColor: "#0f0f0f",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    marginTop: 6,
    color: "#f87171",
    fontSize: 12,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 28,
    marginBottom: 6,
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 18,
    color: "#a49d90",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#c2410c",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  regButton: {
    backgroundColor: "#958d80",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
});
