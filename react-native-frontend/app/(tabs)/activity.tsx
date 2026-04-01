import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  PanResponder,
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
  songImage: any;
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
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
      }
    };

    checkAuth();
    fetchActivityData();

    // Auto-refresh every 30 seconds for friend activity.
    const interval = setInterval(() => {
      fetchActivityData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivityData = async () => {
    await Promise.all([fetchFriends(), fetchRecentReviews()]);
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
          : require("../../assets/images/profile-image.jpg"),
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

      const res = await fetch(`${API_URL}/api/reviews/feed/me`, {
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
            : require("../../assets/images/profile-image.jpg"),
          username: review.user?.username ?? "User",
          rating: review.rating ?? 0,
          songImage: review.music?.coverImage
            ? { uri: review.music.coverImage }
            : require("../../assets/images/good-kid.jpeg"),
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

      {/* Main Content - Recent Reviews */}
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {reviewsError || friendsError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                {reviewsError ?? friendsError}
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchActivityData}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
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
