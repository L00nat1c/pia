import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type UserData = {
  userId?: number;
  username: string;
  email: string;
  birthDate: string;
  lastfmUsername?: string;
};

export default function Settings() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [lastFmUsernameInput, setLastFmUsernameInput] = useState("");
  const [savingLastFm, setSavingLastFm] = useState(false);
  const [lastFmStatusMessage, setLastFmStatusMessage] = useState("");
  const [lastFmStatusType, setLastFmStatusType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // if (!AUTHENTICATION_ENABLED) {
      //   // Use mock data in development mode
      //   setUserData({
      //     userId: 1,
      //     username: "DevUser",
      //     email: "dev@example.com",
      //     birthDate: "1990-01-01",
      //   });
      //   setLoading(false);
      //   return;
      // }

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
      setLastFmUsernameInput(data.lastfmUsername ?? "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);

    try {
      // if (!AUTHENTICATION_ENABLED) {
      //   // Mock success in development mode
      //   setTimeout(() => {
      //     Alert.alert("Success", "Password changed successfully");
      //     setPasswordModalVisible(false);
      //     setCurrentPassword("");
      //     setNewPassword("");
      //     setConfirmPassword("");
      //     setChangingPassword(false);
      //   }, 1000);
      //   return;
      // }

      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(`${API_URL}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        Alert.alert("Error", error || "Failed to change password");
        return;
      }

      Alert.alert("Success", "Password changed successfully");
      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync("token");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Error logging out:", error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleSaveLastFm = async () => {
    try {
      setSavingLastFm(true);
      setLastFmStatusMessage("");
      setLastFmStatusType("");

      if (!AUTHENTICATION_ENABLED) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                lastfmUsername: lastFmUsernameInput.trim() || undefined,
              }
            : prev,
        );
        setLastFmStatusMessage("Last.fm username updated.");
        setLastFmStatusType("success");
        return;
      }

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/me/lastfm`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lastfmUsername: lastFmUsernameInput.trim(),
        }),
      });

      if (!res.ok) {
        setLastFmStatusMessage("Could not save Last.fm username.");
        setLastFmStatusType("error");
        return;
      }

      const updatedUser = await res.json();
      setUserData(updatedUser);
      setLastFmUsernameInput(updatedUser.lastfmUsername ?? "");
      setLastFmStatusMessage("Last.fm username updated.");
      setLastFmStatusType("success");
    } catch (error) {
      console.error("Error saving Last.fm username:", error);
      setLastFmStatusMessage("Could not save Last.fm username.");
      setLastFmStatusType("error");
    } finally {
      setSavingLastFm(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // TODO: Implement account deletion API call
            Alert.alert(
              "Coming Soon",
              "Account deletion will be available soon",
            );
          },
        },
      ],
      { cancelable: true },
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#e5e3e1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <Ionicons name="person-outline" size={20} color="#88827a" />
              <Text style={styles.infoLabelText}>Username</Text>
            </View>
            <Text style={styles.infoValue}>{userData?.username}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <Ionicons name="mail-outline" size={20} color="#88827a" />
              <Text style={styles.infoLabelText}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{userData?.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <Ionicons name="calendar-outline" size={20} color="#88827a" />
              <Text style={styles.infoLabelText}>Birth Date</Text>
            </View>
            <Text style={styles.infoValue}>
              {userData?.birthDate
                ? new Date(userData.birthDate).toLocaleDateString()
                : "Not set"}
            </Text>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setPasswordModalVisible(true)}
          >
            <View style={styles.actionButtonLeft}>
              <Ionicons name="key-outline" size={20} color="#e5e3e1" />
              <Text style={styles.actionButtonText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#88827a" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.integrationCard}>
            <View style={styles.integrationHeader}>
              <Ionicons name="radio-outline" size={20} color="#e5e3e1" />
              <Text style={styles.actionButtonText}>Last.fm Username</Text>
            </View>
            <TextInput
              style={styles.input}
              value={lastFmUsernameInput}
              onChangeText={setLastFmUsernameInput}
              placeholder="Enter your Last.fm username"
              placeholderTextColor="#88827a"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.saveButton, savingLastFm && styles.changePasswordButtonDisabled]}
              onPress={handleSaveLastFm}
              disabled={savingLastFm}
            >
              {savingLastFm ? (
                <ActivityIndicator color="#e5e3e1" />
              ) : (
                <Text style={styles.saveButtonText}>Save Last.fm</Text>
              )}
            </TouchableOpacity>
            {lastFmStatusMessage ? (
              <Text
                style={[
                  styles.lastFmStatusText,
                  lastFmStatusType === "success"
                    ? styles.lastFmSuccessText
                    : styles.lastFmErrorText,
                ]}
              >
                {lastFmStatusMessage}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Notification settings coming soon")
            }
          >
            <View style={styles.actionButtonLeft}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#e5e3e1"
              />
              <Text style={styles.actionButtonText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#88827a" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Privacy settings coming soon")
            }
          >
            <View style={styles.actionButtonLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#e5e3e1" />
              <Text style={styles.actionButtonText}>Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#88827a" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <View style={styles.actionButtonLeft}>
              <Ionicons name="log-out-outline" size={20} color="#c2410c" />
              <Text style={[styles.actionButtonText, styles.logoutText]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.actionButtonLeft}>
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
              <Text style={[styles.actionButtonText, styles.deleteText]}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity
                onPress={() => setPasswordModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#e5e3e1" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#88827a"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#88827a"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#88827a"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.changePasswordButton,
                  changingPassword && styles.changePasswordButtonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <ActivityIndicator color="#e5e3e1" />
                ) : (
                  <Text style={styles.changePasswordButtonText}>
                    Change Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
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
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#88827a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoLabelText: {
    fontSize: 16,
    color: "#e5e3e1",
  },
  infoValue: {
    fontSize: 16,
    color: "#88827a",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#e5e3e1",
  },
  integrationCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  integrationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#716a5d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#e5e3e1",
    fontWeight: "600",
  },
  lastFmStatusText: {
    marginTop: 10,
    fontSize: 13,
  },
  lastFmSuccessText: {
    color: "#4ade80",
  },
  lastFmErrorText: {
    color: "#f87171",
  },
  logoutButton: {
    backgroundColor: "rgba(194, 65, 12, 0.1)",
    borderWidth: 1,
    borderColor: "#c2410c",
  },
  logoutText: {
    color: "#c2410c",
  },
  deleteButton: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  deleteText: {
    color: "#dc2626",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e3e1",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e3e1",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#e5e3e1",
  },
  changePasswordButton: {
    backgroundColor: "#c2410c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  changePasswordButtonDisabled: {
    backgroundColor: "#88827a",
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e3e1",
  },
});
