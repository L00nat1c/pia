// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   RefreshControl,
//   TouchableOpacity,
// } from "react-native";
// import { useEffect, useState } from "react";
// import { useLocalSearchParams, Stack } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { Ionicons } from "@expo/vector-icons";
// //import { API_URL } from "../config";
// import ReviewCard from "../components/ReviewCard";

// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// type UserData = {
//   userId?: number;
//   username: string;
//   email: string;
//   birthDate: string;
//   createdAt?: string;
//   profile_picture?: string;
// };

// export default function UserProfile() {
//   const { id } = useLocalSearchParams();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [userReviews, setUserReviews] = useState<any[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState<
//     "reviews" | "favorites" | "playlists"
//   >("reviews");
//   const [loading, setLoading] = useState(true);
//   const [followingCount, setFollowingCount] = useState(0);

//   useEffect(() => {
//     fetchUserData();
//     fetchUserReviews();
//   }, [id]);

//   const fetchUserData = async () => {
//     try {
//       const token = await SecureStore.getItemAsync("token");
//       const res = await fetch(`${API_URL}/api/users/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setUserData(data);
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserReviews = async () => {
//     // TODO: Connect to backend API for user's reviews
//     // Mock data for now
//     const mockReviews = [
//       {
//         id: 1,
//         profileImage: require("../../assets/images/profile-icon-9.png"),
//         username: userData?.username || "User",
//         rating: 5,
//         songImage: require("../../assets/images/good-kid.jpeg"),
//         songTitle: "good kid, m.A.A.d city",
//         songArtist: "Kendrick Lamar",
//         reviewText: "A cinematic journey through the streets of Compton",
//         likes: 24,
//         comments: 8,
//         repeats: 5,
//       },
//     ];
//     setUserReviews(mockReviews);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([fetchUserData(), fetchUserReviews()]);
//     setRefreshing(false);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   if (!userData) {
//     return (
//       <>
//         <Stack.Screen options={{ title: "Profile" }} />
//         <View style={styles.container}>
//           <Text style={styles.errorText}>User not found</Text>
//         </View>
//       </>
//     );
//   }

//   return (
//     <>
//       <Stack.Screen options={{ title: userData.username }} />
//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={styles.contentContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#c2410c"
//           />
//         }
//       >
//         {/* Profile Header */}
//         <View style={styles.header}>
//           <View style={styles.profileImageContainer}>
//             {/* Vinyl Disk with Profile Image */}
//             <View style={styles.vinylDisk}>
//               {/* Outer black vinyl */}
//               <View style={styles.vinylOuter}>
//                 {/* Vinyl grooves */}
//                 <View style={styles.vinylGroove1} />
//                 <View style={styles.vinylGroove2} />
//                 <View style={styles.vinylGroove3} />
//                 <View style={styles.vinylGroove4} />
//                 <View style={styles.vinylGroove5} />
//                 {/* Profile image in center (replacing the orange label) */}
//                 <View style={styles.profileImageWrapper}>
//                   <Image
//                     source={require("../../assets/images/profile-icon-9.png")}
//                     style={styles.profileImage}
//                   />
//                 </View>
//               </View>
//             </View>
//           </View>
//           <Text style={styles.username}>{userData.username}</Text>
//           {userData.createdAt && (
//             <View style={styles.joinedContainer}>
//               <Ionicons name="calendar-outline" size={14} color="#88827a" />
//               <Text style={styles.joinedText}>
//                 Joined {formatDate(userData.createdAt)}
//               </Text>
//             </View>
//           )}

//           {/* Stats */}
//           <View style={styles.statsContainer}>
//             <TouchableOpacity
//               style={styles.statItem}
//               onPress={() => setActiveTab("reviews")}
//             >
//               <Text style={styles.statNumber}>{userReviews.length}</Text>
//               <Text style={styles.statLabel}>Reviews</Text>
//             </TouchableOpacity>
//             <View style={styles.statDivider} />
//             <TouchableOpacity
//               style={styles.statItem}
//               onPress={() => {
//                 // TODO: Navigate to following list or open modal
//                 console.log("View following list");
//               }}
//             >
//               <Text style={styles.statNumber}>{followingCount}</Text>
//               <Text style={styles.statLabel}>Following</Text>
//             </TouchableOpacity>
//             <View style={styles.statDivider} />
//             <TouchableOpacity
//               style={styles.statItem}
//               onPress={() => setActiveTab("favorites")}
//             >
//               <Text style={styles.statNumber}>0</Text>
//               <Text style={styles.statLabel}>Favorites</Text>
//             </TouchableOpacity>
//           </View>

//           {/* No Edit/Settings buttons for other users' profiles */}
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabsContainer}>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
//             onPress={() => setActiveTab("reviews")}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "reviews" && styles.activeTabText,
//               ]}
//             >
//               Reviews
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
//             onPress={() => setActiveTab("favorites")}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "favorites" && styles.activeTabText,
//               ]}
//             >
//               Favorites
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === "playlists" && styles.activeTab]}
//             onPress={() => setActiveTab("playlists")}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "playlists" && styles.activeTabText,
//               ]}
//             >
//               Playlists
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {activeTab === "reviews" ? (
//             userReviews.length > 0 ? (
//               userReviews.map((review) => (
//                 <ReviewCard
//                   key={review.id}
//                   profileImage={review.profileImage}
//                   username={review.username}
//                   rating={review.rating}
//                   songImage={review.songImage}
//                   songTitle={review.songTitle}
//                   songArtist={review.songArtist}
//                   reviewText={review.reviewText}
//                   likes={review.likes}
//                   comments={review.comments}
//                   repeats={review.repeats}
//                 />
//               ))
//             ) : (
//               <Text style={styles.emptyText}>No reviews yet</Text>
//             )
//           ) : activeTab === "favorites" ? (
//             <Text style={styles.emptyText}>No favorites yet</Text>
//           ) : (
//             <Text style={styles.emptyText}>No playlists yet</Text>
//           )}
//         </View>
//       </ScrollView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#080808",
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   loadingText: {
//     color: "#88827a",
//     fontSize: 16,
//     textAlign: "center",
//     marginTop: 100,
//   },
//   errorText: {
//     color: "#88827a",
//     fontSize: 16,
//     textAlign: "center",
//     marginTop: 100,
//   },
//   header: {
//     alignItems: "center",
//     paddingTop: 20,
//     paddingBottom: 24,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#2a2a2a",
//   },
//   profileImageContainer: {
//     marginBottom: 20,
//   },
//   vinylDisk: {
//     width: 220,
//     height: 220,
//   },
//   vinylOuter: {
//     width: 220,
//     height: 220,
//     borderRadius: 110,
//     backgroundColor: "#1a1a1a", // Black vinyl
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "#0a0a0a",
//     // Vinyl grooves effect
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.6,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   vinylGroove1: {
//     position: "absolute",
//     width: 216,
//     height: 216,
//     borderRadius: 108,
//     borderWidth: 1,
//     borderColor: "rgba(0, 0, 0, 0.4)",
//   },
//   vinylGroove2: {
//     position: "absolute",
//     width: 204,
//     height: 204,
//     borderRadius: 102,
//     borderWidth: 1,
//     borderColor: "rgba(0, 0, 0, 0.35)",
//   },
//   vinylGroove3: {
//     position: "absolute",
//     width: 192,
//     height: 192,
//     borderRadius: 96,
//     borderWidth: 1,
//     borderColor: "rgba(0, 0, 0, 0.4)",
//   },
//   vinylGroove4: {
//     position: "absolute",
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     borderWidth: 1,
//     borderColor: "rgba(0, 0, 0, 0.35)",
//   },
//   vinylGroove5: {
//     position: "absolute",
//     width: 168,
//     height: 168,
//     borderRadius: 84,
//     borderWidth: 1,
//     borderColor: "rgba(0, 0, 0, 0.4)",
//   },
//   profileImageWrapper: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "#2a2a2a",
//   },
//   profileImage: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//   },
//   vinylHole: {
//     position: "absolute",
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: "#080808",
//     borderWidth: 2,
//     borderColor: "#0a0a0a",
//   },
//   username: {
//     color: "#e5e3e1",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   joinedContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   joinedText: {
//     color: "#88827a",
//     fontSize: 14,
//     marginLeft: 6,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     paddingVertical: 16,
//     backgroundColor: "#0f0f0f",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#2a2a2a",
//   },
//   statItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   statNumber: {
//     color: "#e5e3e1",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   statLabel: {
//     color: "#88827a",
//     fontSize: 13,
//     marginTop: 4,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: "#2a2a2a",
//   },
//   tabsContainer: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2a2a2a",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "transparent",
//   },
//   activeTab: {
//     borderBottomColor: "#c2410c",
//   },
//   tabText: {
//     color: "#88827a",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   activeTabText: {
//     color: "#e5e3e1",
//   },
//   content: {
//     width: "100%",
//   },
//   emptyText: {
//     color: "#88827a",
//     fontSize: 14,
//     textAlign: "center",
//     paddingVertical: 40,
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
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

type BackendReview = {
  reviewId: number;
  rating: number;
  reviewText: string;
  user?: {
    userId?: number;
    username?: string;
    profile_picture?: string;
  };
  music?: {
    name?: string;
    coverImage?: string;
    deezerPreviewUrl?: string;
    artist?: {
      name?: string;
    };
  };
};

type ProfileReview = {
  id: number;
  reviewId: number;
  profileImage: any;
  username: string;
  rating: number;
  songImage: string | null;
  deezerPreviewUrl?: string;
  songTitle: string;
  songArtist: string;
  reviewText: string;
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

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<ProfileReview[]>([]);
  const [userReposts, setUserReposts] = useState<ProfileReview[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reviews" | "reposts" | "playlists"
  >("reviews");
  const [loading, setLoading] = useState(true);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [repostsCount, setRepostsCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [playlistFavorites, setPlaylistFavorites] = useState<FavoriteItem[]>(
    [],
  );

  const resolvedUserId = Array.isArray(id) ? id[0] : id;
  const parsedUserId = resolvedUserId ? Number(resolvedUserId) : NaN;

  useEffect(() => {
    const loadProfile = async () => {
      if (!Number.isFinite(parsedUserId)) {
        setUserData(null);
        setUserReviews([]);
        setUserReposts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const viewerId = await fetchCurrentUserId();
      await Promise.all([
        fetchUserData(parsedUserId),
        fetchUserReviews(parsedUserId),
        fetchUserReposts(parsedUserId),
        fetchFollowCounts(parsedUserId),
        fetchPlaylistFavorites(parsedUserId),
        viewerId ? fetchFollowStatus(parsedUserId) : Promise.resolve(),
      ]);
      setLoading(false);
    };

    loadProfile();
  }, [parsedUserId]);

  const fetchCurrentUserId = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return null;
      }

      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return null;
      }

      const data: UserData = await res.json();
      const idFromResponse = data.userId ?? null;
      setCurrentUserId(idFromResponse);
      return idFromResponse;
    } catch (error) {
      console.error("Error fetching current user id:", error);
      return null;
    }
  };

  const fetchUserData = async (userId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const users = await res.json();
        const matchedUser = users.find(
          (user: UserData) => user.userId === userId,
        );
        setUserData(matchedUser ?? null);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserData(null);
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
        setUserReviews([]);
        return;
      }

      const data: BackendReview[] = await res.json();
      const mappedReviews: ProfileReview[] = data.map((review) => ({
        id: review.reviewId,
        reviewId: review.reviewId,
        profileImage: review.user?.profile_picture
          ? { uri: review.user.profile_picture }
          : require("../../assets/images/profile-icon-9.png"),
        username: review.user?.username ?? userData?.username ?? "User",
        rating: review.rating ?? 0,
        songImage: review.music?.coverImage ?? null,
        deezerPreviewUrl: review.music?.deezerPreviewUrl,
        songTitle: review.music?.name ?? "Unknown song",
        songArtist: review.music?.artist?.name ?? "Unknown artist",
        reviewText: review.reviewText ?? "",
      }));

      setUserReviews(mappedReviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      setUserReviews([]);
    }
  };

  const fetchUserReposts = async (userId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        setUserReposts([]);
        return;
      }

      const res = await fetch(`${API_URL}/api/reviews/reposts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setUserReposts([]);
        return;
      }

      const data: BackendReview[] = await res.json();
      const mappedReposts: ProfileReview[] = data.map((review) => ({
        id: review.reviewId,
        reviewId: review.reviewId,
        profileImage: review.user?.profile_picture
          ? { uri: review.user.profile_picture }
          : require("../../assets/images/profile-icon-9.png"),
        username: review.user?.username ?? "User",
        rating: review.rating ?? 0,
        songImage: review.music?.coverImage ?? null,
        deezerPreviewUrl: review.music?.deezerPreviewUrl,
        songTitle: review.music?.name ?? "Unknown song",
        songArtist: review.music?.artist?.name ?? "Unknown artist",
        reviewText: review.reviewText ?? "",
      }));

      setUserReposts(mappedReposts);
      setRepostsCount(mappedReposts.length);
    } catch (error) {
      console.error("Error fetching user reposts:", error);
      setUserReposts([]);
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

  const fetchFollowStatus = async (userId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const res = await fetch(`${API_URL}/api/friends/is-following/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setIsFollowing(false);
        return;
      }

      const data = await res.json();
      setIsFollowing(Boolean(data.following));
    } catch (error) {
      console.error("Error fetching follow status:", error);
      setIsFollowing(false);
    }
  };

  const fetchPlaylistFavorites = async (userId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        return;
      }

      const res = await fetch(`${API_URL}/api/favorites/user/${userId}`, {
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

  const handleToggleFollow = async () => {
    if (
      !Number.isFinite(parsedUserId) ||
      !currentUserId ||
      currentUserId === parsedUserId
    ) {
      return;
    }

    try {
      setFollowLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`${API_URL}/api/friends/follow/${parsedUserId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return;
      }

      setIsFollowing(!isFollowing);
      await fetchFollowCounts(parsedUserId);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (Number.isFinite(parsedUserId)) {
      await Promise.all([
        fetchUserData(parsedUserId),
        fetchUserReviews(parsedUserId),
        fetchUserReposts(parsedUserId),
        fetchFollowCounts(parsedUserId),
        fetchPlaylistFavorites(parsedUserId),
        fetchFollowStatus(parsedUserId),
      ]);
    }
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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

  const isOwnProfile =
    currentUserId !== null && userData.userId === currentUserId;

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
                    source={require("../../assets/images/profile-icon-9.png")}
                    style={styles.profileImage}
                  />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.username}>{userData.username}</Text>
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
              onPress={() => openFollowList("following")}
            >
              <Text style={styles.statNumber}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => openFollowList("followers")}
            >
              <Text style={styles.statNumber}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => setActiveTab("reposts")}
            >
              <Text style={styles.statNumber}>{repostsCount}</Text>
              <Text style={styles.statLabel}>Reposts</Text>
            </TouchableOpacity>
          </View>

          {!isOwnProfile ? (
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={handleToggleFollow}
              disabled={followLoading}
            >
              {followLoading ? (
                <ActivityIndicator color="#e5e3e1" />
              ) : (
                <Text style={styles.followButtonText}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              )}
            </TouchableOpacity>
          ) : null}

          {/* No Edit/Settings buttons for other users' profiles */}
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
            style={[styles.tab, activeTab === "playlists" && styles.activeTab]}
            onPress={() => setActiveTab("playlists")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "playlists" && styles.activeTabText,
              ]}
            >
              Favorites
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
                  reviewId={review.reviewId}
                  profileImage={review.profileImage}
                  username={review.username}
                  rating={review.rating}
                  songImage={review.songImage}
                  deezerPreviewUrl={review.deezerPreviewUrl}
                  songTitle={review.songTitle}
                  songArtist={review.songArtist}
                  reviewText={review.reviewText}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No reviews yet</Text>
            )
          ) : activeTab === "reposts" ? (
            userReposts.length > 0 ? (
              userReposts.map((repost) => (
                <ReviewCard
                  key={repost.id}
                  reviewId={repost.reviewId}
                  profileImage={repost.profileImage}
                  username={repost.username}
                  rating={repost.rating}
                  songImage={repost.songImage}
                  deezerPreviewUrl={repost.deezerPreviewUrl}
                  songTitle={repost.songTitle}
                  songArtist={repost.songArtist}
                  reviewText={repost.reviewText}
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
  followButton: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#c2410c",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c2410c",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  followingButton: {
    backgroundColor: "#0f0f0f",
    borderColor: "#2a2a2a",
  },
  followButtonText: {
    color: "#e5e3e1",
    fontSize: 14,
    fontWeight: "600",
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
