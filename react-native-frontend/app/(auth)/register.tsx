import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type RegisterErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
};

const FALLBACK_TAGS = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Indie",
  "Electronic",
  "Jazz",
  "Country",
  "Classical",
];

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
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthdate] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(FALLBACK_TAGS);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  useEffect(() => {
    let isMounted = true;

    const loadTopTags = async () => {
      try {
        setIsLoadingTags(true);
        const response = await fetch(`${API_URL}/api/lastfm/top-tags?limit=24`);

        if (!response.ok) {
          throw new Error("Could not load top tags");
        }

        const data = await response.json();

        if (isMounted && Array.isArray(data) && data.length > 0) {
          const sanitized = data
            .filter((tag): tag is string => typeof tag === "string")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

          if (sanitized.length > 0) {
            setAvailableTags(sanitized);
          }
        }
      } catch {
        if (isMounted) {
          setAvailableTags(FALLBACK_TAGS);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTags(false);
        }
      }
    };

    loadTopTags();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBirthDateChange = (value: string) => {
    setBirthdate(formatBirthDateInput(value));
  };

  const validateStepOne = () => {
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
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    setErrors({});
    setStep(2);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((existingTag) => existingTag !== tag)
        : [...current, tag],
    );
  };

  const handleRegister = async () => {
    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);

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
          preferredTags: selectedTags,
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
      Alert.alert(
        "Error",
        "Registration failed. Check that your phone can reach the backend server.",
      );
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
            <Text style={styles.stepLabel}>Step {step} of 2</Text>
            <Text style={styles.title}>
              {step === 1 ? "Register" : "Pick your genres"}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? "Create your Play It Again account"
                : "Choose the music you love (optional)"}
            </Text>

            {step === 1 ? (
              <>
                <View style={styles.fieldGroup}>
                  <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="Username"
                    placeholderTextColor="#8f897d"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => {
                      setUsername(value);
                      setErrors((current) => ({
                        ...current,
                        username: undefined,
                      }));
                    }}
                    value={username}
                  />
                  {errors.username ? (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  ) : null}
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
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                      }));
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
                    textContentType="newPassword"
                    onChangeText={(value) => {
                      setPassword(value);
                      setErrors((current) => ({
                        ...current,
                        password: undefined,
                      }));
                    }}
                    value={password}
                  />
                  {errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}
                </View>
                <View style={styles.fieldGroup}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.inputError,
                    ]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#8f897d"
                    secureTextEntry
                    textContentType="password"
                    onChangeText={(value) => {
                      setConfirmPassword(value);
                      setErrors((current) => ({
                        ...current,
                        confirmPassword: undefined,
                      }));
                    }}
                    value={confirmPassword}
                  />
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.fieldGroup}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.birthDate && styles.inputError,
                    ]}
                    placeholder="Birthdate"
                    placeholderTextColor="#8f897d"
                    keyboardType="number-pad"
                    maxLength={10}
                    onChangeText={(value) => {
                      handleBirthDateChange(value);
                      setErrors((current) => ({
                        ...current,
                        birthDate: undefined,
                      }));
                    }}
                    value={birthDate}
                  />
                  <Text
                    style={[
                      styles.helperText,
                      errors.birthDate && styles.errorText,
                    ]}
                  >
                    {errors.birthDate || "Format: YYYY-MM-DD"}
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      isSubmitting && styles.buttonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.buttonText}>Next: Tags</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {isLoadingTags ? (
                  <View style={styles.loadingTagsContainer}>
                    <ActivityIndicator color="#c2410c" />
                    <Text style={styles.helperText}>Loading top tags...</Text>
                  </View>
                ) : null}

                <View style={styles.tagGrid}>
                  {availableTags.map((genre) => {
                    const isSelected = selectedTags.includes(genre);

                    return (
                      <Pressable
                        key={genre}
                        style={[
                          styles.tagChip,
                          isSelected && styles.tagChipSelected,
                        ]}
                        onPress={() => toggleTag(genre)}
                      >
                        <Text
                          style={[
                            styles.tagChipText,
                            isSelected && styles.tagChipTextSelected,
                          ]}
                        >
                          {genre}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.secondaryButton,
                      isSubmitting && styles.buttonDisabled,
                    ]}
                    onPress={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      isSubmitting && styles.buttonDisabled,
                    ]}
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
              </>
            )}
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
  stepLabel: {
    fontSize: 12,
    color: "#8f897d",
    marginBottom: 6,
    letterSpacing: 0.4,
    textTransform: "uppercase",
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
  secondaryButton: {
    backgroundColor: "#2b2b2b",
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
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  loadingTagsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: "#5f594f",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#161616",
  },
  tagChipSelected: {
    borderColor: "#c2410c",
    backgroundColor: "#3f1d0d",
  },
  tagChipText: {
    color: "#c7c0b3",
    fontSize: 13,
    fontWeight: "600",
  },
  tagChipTextSelected: {
    color: "#ffd7bf",
  },
});
