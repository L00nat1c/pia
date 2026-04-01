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
import { router } from "expo-router";
import { API_URL } from "../config";

type RegisterErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
};

function formatBirthDateInput(input: string) {
  const digitsOnly = input.replace(/\D/g, "").slice(0, 8);

  if (digitsOnly.length <= 4) {
    return digitsOnly;
  }

  if (digitsOnly.length <= 6) {
    return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`;
  }

  return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthdate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleBirthDateChange = (value: string) => {
    setBirthdate(formatBirthDateInput(value));
  };

  const handleRegister = async () => {
    const nextErrors: RegisterErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Enter a username.";
    }

    if (!email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter a password.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!birthDate) {
      nextErrors.birthDate = "Enter your birth date.";
    } else if (!isValidBirthDate(birthDate)) {
      nextErrors.birthDate = "Use a real date in YYYY-MM-DD format.";
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

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          username,
          email,
          password,
          birthDate,
        }),
      });

      clearTimeout(timeoutId);

      const data = await res.text();

      if (!res.ok) {
        if (data.includes("username")) {
          setErrors({ username: "Username already taken." });
        } else if (data.includes("email")) {
          setErrors({ email: "Email already in use." });
        } else {
          Alert.alert("Error", "Registration failed");
        }
        return;
      }

      router.replace("/(auth)/login");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Registration failed. Check that your phone can reach the backend server.");
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
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create your Play It Again account</Text>

            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Username"
                placeholderTextColor="#8f897d"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => {
                  setUsername(value);
                  setErrors((current) => ({ ...current, username: undefined }));
                }}
                value={username}
              />
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>
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
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#8f897d"
                secureTextEntry
                textContentType="newPassword"
                onChangeText={(value) => {
                  setPassword(value);
                  setErrors((current) => ({ ...current, password: undefined }));
                }}
                value={password}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor="#8f897d"
                secureTextEntry
                textContentType="password"
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setErrors((current) => ({ ...current, confirmPassword: undefined }));
                }}
                value={confirmPassword}
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>
            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.input, errors.birthDate && styles.inputError]}
                placeholder="Birthdate"
                placeholderTextColor="#8f897d"
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={(value) => {
                  handleBirthDateChange(value);
                  setErrors((current) => ({ ...current, birthDate: undefined }));
                }}
                value={birthDate}
              />
              <Text style={[styles.helperText, errors.birthDate && styles.errorText]}>
                {errors.birthDate || "Format: YYYY-MM-DD"}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
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
  helperText: {
    color: "#8f897d",
    fontSize: 12,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  errorText: {
    color: "#f87171",
    fontSize: 12,
    marginTop: 6,
    paddingHorizontal: 2,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
});
