// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   RefreshControl,
//   TouchableOpacity,
//   Dimensions,
//   PanResponder,
// } from "react-native";
// import { useEffect, useState, useRef } from "react";
// import * as SecureStore from "expo-secure-store";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import ReviewCard from "../components/ReviewCard";
// import FriendsDrawer from "../components/FriendsDrawer";
// import FriendDetailsModal from "../components/FriendDetailsModal";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// type Friend = {
//   id: number;
//   profileImage: any;
//   username: string;
//   songTitle: string;
//   songArtist: string;
//   albumName?: string;
//   albumImage?: any;
//   songTimestamp?: string;
//   isListeningNow: boolean;
//   timeAgo?: string;
// };

// type Review = {
//   id: number;
//   userId: number;
//   profileImage: any;
//   username: string;
//   rating: number;
//   songImage: any;
//   songTitle: string;
//   songArtist: string;
//   reviewText: string;
//   likes: number;
//   comments: number;
//   repeats: number;
// };

// export default function Activity() {
//   const [refreshing, setRefreshing] = useState(false);
//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [recentReviews, setRecentReviews] = useState<Review[]>([]);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const startX = useRef(0);

//   // Pan responder for swipe from right edge
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: (evt) => {
//         // Only respond if touch starts from right edge (last 20px)
//         const touchX = evt.nativeEvent.pageX;
//         startX.current = touchX;
//         return touchX > SCREEN_WIDTH - 20;
//       },
//       onMoveShouldSetPanResponder: (evt, gestureState) => {
//         // Double-check the starting position was from right edge
//         if (startX.current <= SCREEN_WIDTH - 20) {
//           return false;
//         }
//         // Only activate on horizontal left swipe, ignore vertical scrolling
//         return (
//           Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
//           gestureState.dx < -15
//         );
//       },
//       onPanResponderMove: (_, gestureState) => {
//         // Swiping left from right edge
//         if (gestureState.dx < -40) {
//           setIsDrawerOpen(true);
//         }
//       },
//     }),
//   ).current;

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await SecureStore.getItemAsync("token");

//       if (token) {
//         router.replace("/(tabs)");
//       } else {
//         router.replace("/(auth)/login");
//       }
//     };

//     checkAuth();
//     fetchActivityData();

//     // Auto-refresh every 30 seconds for live listening status
//     const interval = setInterval(() => {
//       fetchFriends();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   const fetchActivityData = async () => {
//     await Promise.all([fetchFriends(), fetchRecentReviews()]);
//   };

//   const fetchFriends = async () => {
//     // TODO: Connect to backend API
//     // For now, using mock data
//     const mockData: Friend[] = [
//       {
//         id: 1,
//         profileImage: require("../../assets/images/profile-icon-9.png"),
//         username: "Sergio Guerra",
//         songTitle: "PRIDE.",
//         songArtist: "Kendrick Lamar",
//         albumName: "DAMN.",
//         albumImage: require("../../assets/images/good-kid.jpeg"),
//         songTimestamp: "2:34 / 4:38",
//         isListeningNow: true,
//       },
//       {
//         id: 2,
//         profileImage: require("../../assets/images/profile-icon-9.png"),
//         username: "Alex Johnson",
//         songTitle: "Time",
//         songArtist: "Pink Floyd",
//         albumName: "The Dark Side of the Moon",
//         albumImage: require("../../assets/images/album-cover.svg"),
//         songTimestamp: "3:12 / 6:53",
//         isListeningNow: false,
//         timeAgo: "5 minutes ago",
//       },
//       {
//         id: 3,
//         profileImage: require("../../assets/images/profile-icon-9.png"),
//         username: "Maria Garcia",
//         songTitle: "Bohemian Rhapsody",
//         songArtist: "Queen",
//         albumName: "A Night at the Opera",
//         albumImage: require("../../assets/images/good-kid.jpeg"),
//         songTimestamp: "1:45 / 5:55",
//         isListeningNow: true,
//       },
//     ];
//     setFriends(mockData);
//   };

//   const fetchRecentReviews = async () => {
//     // TODO: Connect to backend API for friends' reviews
//     // For now, using mock data
//     const mockReviews = [
//       {
//         id: 1,
//         userId: 3,
//         profileImage: require("../../assets/images/profile-icon-9.png"),
//         username: "Alex Johnson",
//         rating: 5,
//         songImage: require("../../assets/images/album-cover.svg"),
//         songTitle: "The Dark Side of the Moon",
//         songArtist: "Pink Floyd",
//         reviewText:
//           "A timeless masterpiece that transcends genres and generations",
//         likes: 42,
//         comments: 12,
//         repeats: 3,
//       },
//       {
//         id: 2,
//         userId: 2,
//         profileImage: require("../../assets/images/profile-icon-9.png"),
//         username: "Sergio Guerra",
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
//     setRecentReviews(mockReviews);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchActivityData();
//     setRefreshing(false);
//   };

//   const handlePressFriend = (friend: Friend) => {
//     setSelectedFriend(friend);
//     setIsDetailsModalOpen(true);
//   };

//   const handlePressProfile = () => {
//     // TODO: Navigate to friend's profile
//     setIsDetailsModalOpen(false);
//     console.log("Navigate to profile:", selectedFriend?.username);
//   };

//   return (
//     <View style={styles.mainContainer} {...panResponder.panHandlers}>
//       {/* Friends Button */}
//       <TouchableOpacity
//         style={styles.friendsButton}
//         onPress={() => setIsDrawerOpen(true)}
//       >
//         <Ionicons name="disc" size={20} color="#e5e3e1" />
//       </TouchableOpacity>

//       {/* Main Content - Recent Reviews */}
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
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Recent Reviews</Text>
//           {recentReviews.length > 0 ? (
//             recentReviews.map((review) => (
//               <ReviewCard
//                 key={review.id}
//                 reviewId={review.id}
//                 profileImage={review.profileImage}
//                 username={review.username}
//                 rating={review.rating}
//                 songImage={review.songImage}
//                 songTitle={review.songTitle}
//                 songArtist={review.songArtist}
//                 reviewText={review.reviewText}
//                 initialLikes={review.likes}
//                 initialComments={review.comments}
//                 onPressProfile={() =>
//                   router.push({
//                     pathname: "/user/[id]",
//                     params: { id: review.userId },
//                   })
//                 }
//                 repeats={review.repeats}
//               />
//             ))
//           ) : (
//             <Text style={styles.emptyText}>No recent reviews from friends</Text>
//           )}
//         </View>
//       </ScrollView>

//       {/* Friends Drawer */}
//       <FriendsDrawer
//         visible={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         friends={friends}
//         onPressFriend={handlePressFriend}
//       />

//       {/* Friend Details Modal */}
//       {selectedFriend && (
//         <FriendDetailsModal
//           visible={isDetailsModalOpen}
//           onClose={() => setIsDetailsModalOpen(false)}
//           profileImage={selectedFriend.profileImage}
//           username={selectedFriend.username}
//           songTitle={selectedFriend.songTitle}
//           songArtist={selectedFriend.songArtist}
//           albumName={selectedFriend.albumName}
//           albumImage={selectedFriend.albumImage}
//           songTimestamp={selectedFriend.songTimestamp}
//           isListeningNow={selectedFriend.isListeningNow}
//           onPressProfile={handlePressProfile}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: "#080808",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#080808",
//   },
//   contentContainer: {
//     paddingTop: 48,
//   },
//   friendsButton: {
//     position: "absolute",
//     top: 8,
//     right: 12,
//     zIndex: 100,
//     backgroundColor: "#0f0f0f",
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#2a2a2a",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   section: {
//     width: "100%",
//   },
//   sectionTitle: {
//     color: "#e5e3e1",
//     fontSize: 18,
//     fontWeight: "bold",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#2a2a2a",
//   },
//   emptyText: {
//     color: "#88827a",
//     fontSize: 14,
//     textAlign: "center",
//     paddingVertical: 40,
//     paddingHorizontal: 16,
//   },
// });

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Image,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/app/config";
import { formatActivityTimeLabel } from "@/app/utils/activityTime";
import ReviewCard from "../components/ReviewCard";
import FriendsDrawer from "../components/FriendsDrawer";
import FriendDetailsModal from "../components/FriendDetailsModal";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Friend = {
  id: number;
  profileImage: any;
  username: string;
  songTitle: string;
  songArtist: string;
  albumName?: string;
  albumImage?: any;
  songTimestamp?: string;
  isListeningNow: boolean;
  reviewDate?: string;
};

type Review = {
  id: number;
  userId: number;
  profileImage: any;
  username: string;
  rating: number;
  songImage: string;
  songTitle: string;
  songArtist: string;
  reviewText: string;
  likes: number;
  comments: number;
  repeats: number;
};

type BackendFriendActivity = {
  userId: number;
  username: string;
  profilePicture?: string;
  songTitle?: string;
  songArtist?: string;
  albumName?: string;
  albumImage?: string;
  reviewDate?: string;
  isListeningNow?: boolean;
  rating?: number;
  reviewText?: string;
};

type Follower = {
  userId: number;
  username: string;
  profilePicture?: string;
};

type BackendReview = {
  reviewId: number;
  reviewText?: string;
  reviewDate?: string;
  rating?: number;
  user?: {
    userId?: number;
    username?: string;
    profile_picture?: string;
  };
  music?: {
    name?: string;
    coverImage?: string;
    cover_image?: string;
    artist?: {
      name?: string;
    };
  };
};

export default function Activity() {
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followBackStatus, setFollowBackStatus] = useState<
    Record<number, boolean>
  >({});
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const startX = useRef(0);

  const navigateToUserProfile = (userId?: number) => {
    if (!userId || userId <= 0) {
      return;
    }

    router.push({
      pathname: "/user/[id]",
      params: { id: userId },
    });
  };

  // Pan responder for swipe from right edge
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only respond if touch starts from right edge (last 20px)
        const touchX = evt.nativeEvent.pageX;
        startX.current = touchX;
        return touchX > SCREEN_WIDTH - 20;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Double-check the starting position was from right edge
        if (startX.current <= SCREEN_WIDTH - 20) {
          return false;
        }
        // Only activate on horizontal left swipe, ignore vertical scrolling
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          gestureState.dx < -15
        );
      },
      onPanResponderMove: (_, gestureState) => {
        // Swiping left from right edge
        if (gestureState.dx < -40) {
          setIsDrawerOpen(true);
        }
      },
    }),
  ).current;

  useEffect(() => {
    fetchActivityData();

    // Auto-refresh every 30 seconds for friend activity.
    const interval = setInterval(() => {
      fetchActivityData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivityData = async () => {
    await Promise.all([fetchFriends(), fetchRecentReviews(), fetchFollowers()]);
  };

  const fetchFollowers = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/friends/followers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data: Follower[] = await res.json();
      setFollowers(data);

      // Check follow-back status for each follower in parallel
      const statusEntries = await Promise.all(
        data.map(async (follower) => {
          try {
            const r = await fetch(
              `${API_URL}/api/friends/is-following/${follower.userId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (!r.ok) return [follower.userId, false] as const;
            const json = await r.json();
            return [follower.userId, json.following ?? false] as const;
          } catch {
            return [follower.userId, false] as const;
          }
        }),
      );
      setFollowBackStatus(Object.fromEntries(statusEntries));
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const handleFollowBack = async (targetUserId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      await fetch(`${API_URL}/api/friends/follow/${targetUserId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowBackStatus((prev) => ({ ...prev, [targetUserId]: true }));
    } catch (error) {
      console.error("Error following back:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/friends/activity/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setFriendsError("Could not load friend activity.");
        setFriends([]);
        return;
      }

      const data: BackendFriendActivity[] = await res.json();
      const mappedFriends: Friend[] = data.map((friend) => ({
        id: friend.userId,
        profileImage: friend.profilePicture
          ? { uri: friend.profilePicture }
          : require("../../assets/images/profile-icon-9.png"),
        username: friend.username,
        songTitle: friend.songTitle ?? "No recent track",
        songArtist: friend.songArtist ?? "No recent artist",
        albumName: friend.albumName,
        albumImage: friend.albumImage ? { uri: friend.albumImage } : undefined,
        songTimestamp: undefined,
        isListeningNow: friend.isListeningNow ?? false,
        reviewDate: friend.reviewDate,
      }));

      setFriendsError(null);
      setFriends(mappedFriends);
    } catch (error) {
      console.error("Error fetching friend activity:", error);
      setFriendsError("Could not load friend activity.");
      setFriends([]);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/reviews/following`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setReviewsError("Could not load recent reviews.");
        setRecentReviews([]);
        return;
      }

      const data: BackendReview[] = await res.json();
      const mappedReviews: Review[] = data
        .filter((review) => (review.user?.userId ?? 0) > 0)
        .map((review) => ({
          id: review.reviewId,
          userId: review.user?.userId ?? 0,
          profileImage: review.user?.profile_picture
            ? { uri: review.user.profile_picture }
            : require("../../assets/images/profile-icon-9.png"),
          username: review.user?.username ?? "User",
          rating: review.rating ?? 0,
          songImage:
            review.music?.coverImage ?? review.music?.cover_image ?? "",
          songTitle: review.music?.name ?? "Unknown song",
          songArtist: review.music?.artist?.name ?? "Unknown artist",
          reviewText: review.reviewText ?? "",
          likes: 0,
          comments: 0,
          repeats: 0,
        }));

      setReviewsError(null);
      setRecentReviews(mappedReviews);
    } catch (error) {
      console.error("Error fetching activity feed:", error);
      setReviewsError("Could not load recent reviews.");
      setRecentReviews([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivityData();
    setRefreshing(false);
  };

  const handlePressFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsDetailsModalOpen(true);
  };

  const handlePressFriendProfile = (friend: Friend) => {
    setIsDrawerOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedFriend(friend);
    navigateToUserProfile(friend.id);
  };

  const handlePressProfile = () => {
    if (!selectedFriend) {
      return;
    }

    setIsDetailsModalOpen(false);
    navigateToUserProfile(selectedFriend.id);
  };

  return (
    <View style={styles.mainContainer} {...panResponder.panHandlers}>
      {/* Friends Button */}
      <TouchableOpacity
        style={styles.friendsButton}
        onPress={() => setIsDrawerOpen(true)}
      >
        <Ionicons name="disc" size={20} color="#e5e3e1" />
      </TouchableOpacity>

      {/* Main Content */}
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
        {/* Notifications */}
        {followers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {followers.map((follower) => (
              <TouchableOpacity
                key={follower.userId}
                style={styles.notificationRow}
                onPress={() => navigateToUserProfile(follower.userId)}
              >
                <Image
                  source={
                    follower.profilePicture
                      ? { uri: follower.profilePicture }
                      : require("../../assets/images/profile-icon-9.png")
                  }
                  style={styles.notificationAvatar}
                />
                <Text style={styles.notificationText}>
                  <Text style={styles.notificationUsername}>
                    {follower.username}
                  </Text>
                  {" started following you"}
                </Text>
                {followBackStatus[follower.userId] ? (
                  <View style={styles.followedBadge}>
                    <Text style={styles.followedBadgeText}>Followed</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.followBackButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFollowBack(follower.userId);
                    }}
                  >
                    <Text style={styles.followBackButtonText}>Follow Back</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {reviewsError || friendsError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                {reviewsError ?? friendsError}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchActivityData}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <ReviewCard
                key={review.id}
                reviewId={review.id}
                profileImage={review.profileImage}
                username={review.username}
                rating={review.rating}
                songImage={review.songImage}
                songTitle={review.songTitle}
                songArtist={review.songArtist}
                reviewText={review.reviewText}
                initialLikes={review.likes}
                initialComments={review.comments}
                onPressProfile={() => navigateToUserProfile(review.userId)}
                repeats={review.repeats}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No recent reviews from friends</Text>
          )}
        </View>
      </ScrollView>

      {/* Friends Drawer */}
      <FriendsDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        friends={friends}
        onPressFriendSong={handlePressFriend}
        onPressFriendProfile={handlePressFriendProfile}
      />

      {/* Friend Details Modal */}
      {selectedFriend && (
        <FriendDetailsModal
          visible={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          profileImage={selectedFriend.profileImage}
          username={selectedFriend.username}
          songTitle={selectedFriend.songTitle}
          songArtist={selectedFriend.songArtist}
          albumName={selectedFriend.albumName}
          albumImage={selectedFriend.albumImage}
          songTimestamp={selectedFriend.songTimestamp}
          isListeningNow={selectedFriend.isListeningNow}
          reviewDate={selectedFriend.reviewDate}
          onPressProfile={handlePressProfile}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#080808",
  },
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  contentContainer: {
    paddingTop: 48,
  },
  friendsButton: {
    position: "absolute",
    top: 8,
    right: 12,
    zIndex: 100,
    backgroundColor: "#0f0f0f",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    color: "#e5e3e1",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  emptyText: {
    color: "#88827a",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  notificationAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
    color: "#88827a",
    fontSize: 14,
  },
  notificationUsername: {
    color: "#e5e3e1",
    fontWeight: "600",
  },
  followBackButton: {
    backgroundColor: "#c2410c",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  followBackButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  followedBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  followedBadgeText: {
    color: "#88827a",
    fontSize: 12,
    fontWeight: "600",
  },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6d675a",
    backgroundColor: "#131516",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorBannerText: {
    color: "#e5e3e1",
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  retryButton: {
    backgroundColor: "#716a5d",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
