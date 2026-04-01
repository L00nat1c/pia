import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { API_URL, AUTHENTICATION_ENABLED } from "@/app/config";

type UserData = {
  userId?: number;
  username: string;
  bio?: string;
  profile_picture?: string;
};

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!AUTHENTICATION_ENABLED) {
        setLoading(false);
        return;
      }

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.replace("/(auth)/login");
        return;
      }

      const data: UserData = await res.json();
      setUserData(data);
      setUsernameInput(data.username ?? "");
      setBioInput(data.bio ?? "");
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!usernameInput.trim()) {
      setStatusMessage("Username cannot be empty.");
      setStatusType("error");
      return;
    }

    try {
      setSaving(true);
      setStatusMessage("");
      setStatusType("");

      if (!AUTHENTICATION_ENABLED) {
        setStatusMessage("Profile updated.");
        setStatusType("success");
        return;
      }

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: usernameInput.trim(),
          bio: bioInput.trim(),
        }),
      });

      if (!res.ok) {
        setStatusMessage("Could not save profile.");
        setStatusType("error");
        return;
      }

      const updated: UserData = await res.json();
      setUserData(updated);
      setUsernameInput(updated.username ?? "");
      setBioInput(updated.bio ?? "");
      setStatusMessage("Profile updated.");
      setStatusType("success");
    } catch (error) {
      console.error("Error saving profile:", error);
      setStatusMessage("Could not save profile.");
      setStatusType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      "Change Photo",
      "Image upload is coming soon. Stay tuned!",
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c2410c" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Inner header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#e5e3e1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile picture */}
        <TouchableOpacity style={styles.avatarContainer} onPress={handleChangePhoto} activeOpacity={0.8}>
          {userData?.profile_picture ? (
            <Image source={{ uri: userData.profile_picture }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color="#88827a" />
            </View>
          )}
          <View style={styles.cameraOverlay}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoHint}>Change photo (coming soon)</Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={usernameInput}
              onChangeText={(text) => {
                setUsernameInput(text);
                setStatusMessage("");
              }}
              placeholder="Enter username"
              placeholderTextColor="#88827a"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="next"
            />
            <Text style={styles.charCount}>{usernameInput.length}/30</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bioInput}
              onChangeText={(text) => {
                setBioInput(text);
                setStatusMessage("");
              }}
              placeholder="Tell people a bit about yourself..."
              placeholderTextColor="#88827a"
              multiline
              numberOfLines={4}
              maxLength={300}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bioInput.length}/300</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#e5e3e1" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {statusMessage ? (
            <Text
              style={[
                styles.statusText,
                statusType === "success" ? styles.successText : styles.errorText,
              ]}
            >
              {statusMessage}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e3e1",
  },
  headerSpacer: {
    width: 40,
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: 28,
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#c2410c",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#080808",
  },
  changePhotoHint: {
    color: "#88827a",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 28,
  },
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: "#88827a",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    color: "#e5e3e1",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  charCount: {
    color: "#4a4a4a",
    fontSize: 12,
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: "#c2410c",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#88827a",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  statusText: {
    textAlign: "center",
    fontSize: 14,
  },
  successText: {
    color: "#4ade80",
  },
  errorText: {
    color: "#f87171",
  },
});
