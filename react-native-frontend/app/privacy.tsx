import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyScreen() {
  const [showProfilePublic, setShowProfilePublic] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#e5e3e1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Public Profile</Text>
            <Text style={styles.rowSubtitle}>Allow others to view your profile</Text>
          </View>
          <Switch
            value={showProfilePublic}
            onValueChange={setShowProfilePublic}
            trackColor={{ false: "#3f3f46", true: "#c2410c" }}
            thumbColor="#e5e3e1"
          />
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Show Activity</Text>
            <Text style={styles.rowSubtitle}>Share your recent activity with friends</Text>
          </View>
          <Switch
            value={showActivity}
            onValueChange={setShowActivity}
            trackColor={{ false: "#3f3f46", true: "#c2410c" }}
            thumbColor="#e5e3e1"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
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
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  rowTitle: {
    color: "#e5e3e1",
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: "#88827a",
    fontSize: 12,
    marginTop: 4,
  },
});
