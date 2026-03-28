// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useEffect, useState } from "react";
// import * as SecureStore from "expo-secure-store";
// import { router } from "expo-router";

// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export default function Profile() {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("token");

//         if (!token) {
//           router.replace("/(auth)/login");
//           return;
//         }

//         const res = await fetch(`${API_URL}/api/users/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           router.replace("/(auth)/login");
//           return;
//         }

//         const data = await res.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     await SecureStore.deleteItemAsync("token");
//     router.replace("/(auth)/login");
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Profile Screen</Text>
//       <View style={styles.fieldContainer}>
//         <Text style={styles.fieldText}>Username: {userData?.username}</Text>
//       </View>
//       <View style={styles.fieldContainer}>
//         <Text style={styles.fieldText}>Email: {userData?.email}</Text>
//       </View>
//       <View style={styles.fieldContainer}>
//         <Text style={styles.fieldText}>Birth Date: {userData?.birthDate}</Text>
//       </View>

//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#080808",
//   },
//   fieldContainer: {
//     marginVertical: 10,
//   },
//   fieldText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   logoutButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#ff4d4d",
//     borderRadius: 5,
//   },
//   logoutText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

////////////////////////////////////////////////////////////////////////////////////////////////

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
};

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reviews" | "favorites" | "playlists"
  >("reviews");
  const [followingCount, setFollowingCount] = useState(0);
  const isOwnProfile = true; // Always true for the profile tab

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserReviews();
  }, [userData]);

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

  const fetchUserReviews = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/reviews/user/${userData?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        console.error("Failed to fetch user reviews");
        return;
      }

      const data = await res.json();
      setUserReviews(data);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserData(), fetchUserReviews()]);
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile" as any);
  };

  // const handleSettings = () => {
  //   router.push("/settings");
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/(auth)/login");
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
              onPress={handleLogout}
            >
              <Ionicons name="exit-outline" size={20} color="#e5e3e1" />
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
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
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
          style={[styles.tab, activeTab === "playlists" && styles.activeTab]}
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
                key={review.reviewId}
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
});
