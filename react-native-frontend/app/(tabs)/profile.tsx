import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ReviewCard from "../components/ReviewCard";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
type UserData = {
  userId?: number;
  username: string;
  email: string;
  birthDate: string;
  createdAt?: string;
  profile_picture?: string;
  bio?: string;
};

type FavoriteItem = {
  favoriteId?: number;
  addedAt?: string;
  music?: {
    musicId?: number;
    name?: string;
    coverImage?: string;
    artist?: {
      name?: string;
    };
  };
};

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reviews" | "reposts" | "favorites"
  >("reviews");
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [playlistFavorites, setPlaylistFavorites] = useState<FavoriteItem[]>(
    [],
  );
  const [userReposts, setUserReposts] = useState<any[]>([]);
  const isOwnProfile = true; // Always true for the profile tab

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.userId) {
      fetchUserReviews(userData.userId);
      fetchFollowCounts(userData.userId);
      fetchPlaylistFavorites();
      fetchUserReposts();
    }
  }, [userData?.userId]);

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

  const fetchUserReviews = async (userId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/reviews/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch user reviews");
        return;
      }

      const data = await res.json();
      const sortedReviews = Array.isArray(data)
        ? [...data].sort((a, b) => {
            const aTime = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
            const bTime = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
            const safeATime = Number.isFinite(aTime) ? aTime : 0;
            const safeBTime = Number.isFinite(bTime) ? bTime : 0;

            if (safeATime !== safeBTime) {
              return safeBTime - safeATime;
            }

            return (b?.reviewId ?? 0) - (a?.reviewId ?? 0);
          })
        : [];

      setUserReviews(sortedReviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  const fetchFollowCounts = async (userId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const res = await fetch(`${API_URL}/api/friends/counts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setFollowingCount(data.followingCount ?? 0);
      setFollowersCount(data.followersCount ?? 0);
    } catch (error) {
      console.error("Error fetching follow counts:", error);
    }
  };

  const fetchPlaylistFavorites = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const res = await fetch(`${API_URL}/api/favorites/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setPlaylistFavorites([]);
        return;
      }

      const data: FavoriteItem[] = await res.json();
      setPlaylistFavorites(data);
    } catch (error) {
      console.error("Error fetching playlist favorites:", error);
      setPlaylistFavorites([]);
    }
  };

  const fetchUserReposts = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const res = await fetch(
        `${API_URL}/api/reviews/reposts/user/${userData?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        setUserReposts([]);
        return;
      }

      const data = await res.json();
      setUserReposts(data);
    } catch (error) {
      console.error("Error fetching user reposts:", error);
      setUserReposts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchUserReviews(userData?.userId ?? 0);
    await fetchPlaylistFavorites();
    await fetchUserReposts();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  // const handleSettings = () => {
  //   router.push("/settings");
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleOpenSettings = () => {
    router.push("/settings");
  };

  const openFollowList = (mode: "following" | "followers") => {
    if (!userData?.userId) {
      return;
    }

    router.push({
      pathname: "/follow-list",
      params: {
        userId: String(userData.userId),
        mode,
      },
    });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#c2410c"
        />
      }
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {/* Vinyl Disk with Profile Image */}
          <View style={styles.vinylDisk}>
            {/* Outer black vinyl */}
            <View style={styles.vinylOuter}>
              {/* Vinyl grooves */}
              <View style={styles.vinylGroove1} />
              <View style={styles.vinylGroove2} />
              <View style={styles.vinylGroove3} />
              <View style={styles.vinylGroove4} />
              <View style={styles.vinylGroove5} />
              {/* Profile image in center (replacing the orange label) */}
              <View style={styles.profileImageWrapper}>
                <Image
                  source={require("../../assets/images/profile-icon-9.png")}
                  style={styles.profileImage}
                />
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (userData.userId) {
              router.push({
                pathname: "/user/[id]",
                params: { id: String(userData.userId) },
              });
            }
          }}
        >
          <Text style={styles.username}>{userData.username}</Text>
        </TouchableOpacity>
        {userData.bio ? <Text style={styles.bio}>{userData.bio}</Text> : null}
        {userData.createdAt && (
          <View style={styles.joinedContainer}>
            <Ionicons name="calendar-outline" size={14} color="#88827a" />
            <Text style={styles.joinedText}>
              Joined {formatDate(userData.createdAt)}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setActiveTab("reviews")}
          >
            <Text style={styles.statNumber}>{userReviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setActiveTab("reposts")}
          >
            <Text style={styles.statNumber}>{userReposts.length}</Text>
            <Text style={styles.statLabel}>Reposts</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => openFollowList("followers")}
          >
            <Text style={styles.statNumber}>{followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile & Settings Buttons - Only visible on own profile */}
        {isOwnProfile && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={16} color="#e5e3e1" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleOpenSettings}
            >
              <Ionicons name="settings-outline" size={20} color="#e5e3e1" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reviews" && styles.activeTabText,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "reposts" && styles.activeTab]}
          onPress={() => setActiveTab("reposts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reposts" && styles.activeTabText,
            ]}
          >
            Reposts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
          onPress={() => setActiveTab("favorites")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "favorites" && styles.activeTabText,
            ]}
          >
            Placeholder
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "reviews" ? (
          userReviews.length > 0 ? (
            userReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                reviewId={review.reviewId}
                profileImage={review.user?.profileImage}
                username={review.user?.username}
                rating={review.rating}
                songImage={review.music?.coverImage}
                songTitle={review.music?.name}
                songArtist={review.music?.artist?.name}
                reviewText={review.reviewText}
                initialLikes={review.likesCount}
                initialComments={review.comments}
                repeats={review.repostsCount || 0}
                deezerPreviewUrl={review.music?.deezerPreviewUrl}
                onLike={undefined}
                onComment={undefined}
                onShare={undefined}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No reviews yet</Text>
          )
        ) : activeTab === "reposts" ? (
          userReposts.length > 0 ? (
            userReposts.map((review) => (
              <ReviewCard
                key={`repost-${review.reviewId}`}
                reviewId={review.reviewId}
                profileImage={review.user?.profileImage}
                username={review.user?.username}
                rating={review.rating}
                songImage={review.music?.coverImage}
                songTitle={review.music?.name}
                songArtist={review.music?.artist?.name}
                reviewText={review.reviewText}
                initialLikes={review.likesCount}
                initialComments={review.comments}
                repeats={review.repostsCount || 0}
                deezerPreviewUrl={review.music?.deezerPreviewUrl}
                onLike={undefined}
                onComment={undefined}
                onShare={undefined}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No reposts yet</Text>
          )
        ) : playlistFavorites.length > 0 ? (
          playlistFavorites.map((favorite) => (
            <View
              key={
                favorite.favoriteId ??
                `${favorite.music?.musicId}-${favorite.addedAt}`
              }
              style={styles.playlistItem}
            >
              <Image
                source={
                  favorite.music?.coverImage
                    ? { uri: favorite.music.coverImage }
                    : require("../../assets/images/good-kid.jpeg")
                }
                style={styles.playlistCover}
              />
              <View style={styles.playlistMeta}>
                <Text style={styles.playlistTitle} numberOfLines={1}>
                  {favorite.music?.name ?? "Unknown song"}
                </Text>
                <Text style={styles.playlistArtist} numberOfLines={1}>
                  {favorite.music?.artist?.name ?? "Unknown artist"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No favorite songs yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    color: "#88827a",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  vinylDisk: {
    width: 220,
    height: 220,
  },
  vinylOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#1a1a1a", // Black vinyl
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0a0a0a",
    // Vinyl grooves effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
  },
  vinylGroove1: {
    position: "absolute",
    width: 216,
    height: 216,
    borderRadius: 108,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
  },
  vinylGroove2: {
    position: "absolute",
    width: 186,
    height: 186,
    borderRadius: 93,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.35)",
  },
  vinylGroove3: {
    position: "absolute",
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
  },
  vinylGroove4: {
    position: "absolute",
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.35)",
  },
  vinylGroove5: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    color: "#e5e3e1",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    color: "#88827a",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  joinedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  joinedText: {
    color: "#88827a",
    fontSize: 14,
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: "#e5e3e1",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#88827a",
    fontSize: 13,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#2a2a2a",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 8,
  },
  editButtonText: {
    color: "#e5e3e1",
    fontSize: 15,
    fontWeight: "600",
  },
  settingsButton: {
    backgroundColor: "#0f0f0f",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#c2410c",
  },
  tabText: {
    color: "#88827a",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#e5e3e1",
  },
  content: {
    width: "100%",
  },
  emptyText: {
    color: "#88827a",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 40,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  playlistCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },
  playlistMeta: {
    marginLeft: 12,
    flex: 1,
  },
  playlistTitle: {
    color: "#e5e3e1",
    fontSize: 15,
    fontWeight: "600",
  },
  playlistArtist: {
    color: "#88827a",
    fontSize: 13,
    marginTop: 2,
  },
});
