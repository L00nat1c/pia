import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/app/config";

type FollowMode = "following" | "followers";

type FollowUser = {
  userId: number;
  username: string;
  profilePicture?: string;
  bio?: string;
};

export default function FollowListScreen() {
  const { userId, mode } = useLocalSearchParams<{ userId?: string; mode?: string }>();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<FollowUser[]>([]);

  const parsedUserId = Number(userId);
  const resolvedMode: FollowMode = mode === "followers" ? "followers" : "following";

  const title = useMemo(() => {
    const baseTitle = resolvedMode === "following" ? "Following" : "Followers";
    return `${baseTitle} (${users.length})`;
  }, [resolvedMode, users.length]);

  const emptyMessage = useMemo(() => {
    return resolvedMode === "following" ? "Following none!" : "Followers none!";
  }, [resolvedMode]);

  useEffect(() => {
    const loadList = async () => {
      if (!Number.isFinite(parsedUserId)) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
          router.replace("/(auth)/login");
          return;
        }

        const endpoint =
          resolvedMode === "following"
            ? `${API_URL}/api/friends/following/${parsedUserId}`
            : `${API_URL}/api/friends/followers/${parsedUserId}`;

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setUsers([]);
          return;
        }

        const data: FollowUser[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error loading follow list:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, [parsedUserId, resolvedMode]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#e5e3e1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#c2410c" />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.userId)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userRow}
              onPress={() =>
                router.push({
                  pathname: "/user/[id]",
                  params: { id: String(item.userId) },
                })
              }
            >
              <Image
                source={
                  item.profilePicture
                    ? { uri: item.profilePicture }
                    : require("../assets/images/profile-image.jpg")
                }
                style={styles.avatar}
              />
              <View style={styles.userMeta}>
                <Text style={styles.username}>{item.username}</Text>
                {item.bio ? <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#3a3a3a" />
            </TouchableOpacity>
          )}
        />
      )}
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
    color: "#e5e3e1",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#88827a",
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  username: {
    color: "#e5e3e1",
    fontSize: 15,
    fontWeight: "600",
  },
  bio: {
    color: "#88827a",
    fontSize: 12,
    marginTop: 2,
  },
});
