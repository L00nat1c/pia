import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../config";
import ReviewCard from "../components/ReviewCard";

type UserData = {
  userId?: number;
  username: string;
  email: string;
  birthDate: string;
  createdAt?: string;
  profile_picture?: string;
};

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "favorites" | "playlists">("reviews");
  const [loading, setLoading] = useState(true);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    fetchUserData();
    fetchUserReviews();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    // TODO: Connect to backend API for user's reviews
    // Mock data for now
    const mockReviews = [
      {
        id: 1,
        profileImage: require("../../assets/images/profile-image.jpg"),
        username: userData?.username || "User",
        rating: 5,
        songImage: require("../../assets/images/good-kid.jpeg"),
        songTitle: "good kid, m.A.A.d city",
        songArtist: "Kendrick Lamar",
        reviewText: "A cinematic journey through the streets of Compton",
        likes: 24,
        comments: 8,
        repeats: 5,
      },
    ];
    setUserReviews(mockReviews);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserData(), fetchUserReviews()]);
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <>
        <Stack.Screen options={{ title: "Profile" }} />
        <View style={styles.container}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: userData.username }} />
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
                    source={require("../../assets/images/profile-image.jpg")}
                    style={styles.profileImage}
                  />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.username}>{userData.username}</Text>
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
              onPress={() => {
                // TODO: Navigate to following list or open modal
                console.log("View following list");
              }}
            >
              <Text style={styles.statNumber}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => setActiveTab("favorites")}
            >
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </TouchableOpacity>
          </View>

          {/* No Edit/Settings buttons for other users' profiles */}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "reviews" && styles.activeTab,
            ]}
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
            style={[
              styles.tab,
              activeTab === "favorites" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("favorites")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "favorites" && styles.activeTabText,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "playlists" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("playlists")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "playlists" && styles.activeTabText,
              ]}
            >
              Playlists
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === "reviews" ? (
            userReviews.length > 0 ? (
              userReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  profileImage={review.profileImage}
                  username={review.username}
                  rating={review.rating}
                  songImage={review.songImage}
                  songTitle={review.songTitle}
                  songArtist={review.songArtist}
                  reviewText={review.reviewText}
                  likes={review.likes}
                  comments={review.comments}
                  repeats={review.repeats}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No reviews yet</Text>
            )
          ) : activeTab === "favorites" ? (
            <Text style={styles.emptyText}>No favorites yet</Text>
          ) : (
            <Text style={styles.emptyText}>No playlists yet</Text>
          )}
        </View>
      </ScrollView>
    </>
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
  errorText: {
    color: "#88827a",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
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
    width: 204,
    height: 204,
    borderRadius: 102,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.35)",
  },
  vinylGroove3: {
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
  },
  vinylGroove4: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.35)",
  },
  vinylGroove5: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
  },
  profileImageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  vinylHole: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#080808",
    borderWidth: 2,
    borderColor: "#0a0a0a",
  },
  username: {
    color: "#e5e3e1",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
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
});
