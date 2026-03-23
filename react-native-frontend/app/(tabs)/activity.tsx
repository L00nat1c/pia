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
import { AUTHENTICATION_ENABLED } from "../config";
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
  timeAgo?: string;
};

type Review = {
  id: number;
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

export default function Activity() {
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const startX = useRef(0);

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
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx < -15;
      },
      onPanResponderMove: (_, gestureState) => {
        // Swiping left from right edge
        if (gestureState.dx < -40) {
          setIsDrawerOpen(true);
        }
      },
    })
  ).current;

  useEffect(() => {
    const checkAuth = async () => {
      if (!AUTHENTICATION_ENABLED) {
        // Skip authentication check in development mode
        return;
      }

      const token = await SecureStore.getItemAsync("token");

      if (token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    };

    checkAuth();
    fetchActivityData();

    // Auto-refresh every 30 seconds for live listening status
    const interval = setInterval(() => {
      fetchFriends();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivityData = async () => {
    await Promise.all([fetchFriends(), fetchRecentReviews()]);
  };

  const fetchFriends = async () => {
    // TODO: Connect to backend API
    // For now, using mock data
    const mockData: Friend[] = [
      {
        id: 1,
        profileImage: require("../../assets/images/profile-icon-9.png"),
        username: "Sergio Guerra",
        songTitle: "PRIDE.",
        songArtist: "Kendrick Lamar",
        albumName: "DAMN.",
        albumImage: require("../../assets/images/good-kid.jpeg"),
        songTimestamp: "2:34 / 4:38",
        isListeningNow: true,
      },
      {
        id: 2,
        profileImage: require("../../assets/images/profile-image.jpg"),
        username: "Alex Johnson",
        songTitle: "Time",
        songArtist: "Pink Floyd",
        albumName: "The Dark Side of the Moon",
        albumImage: require("../../assets/images/album-cover.svg"),
        songTimestamp: "3:12 / 6:53",
        isListeningNow: false,
        timeAgo: "5 minutes ago",
      },
      {
        id: 3,
        profileImage: require("../../assets/images/profile-icon-9.png"),
        username: "Maria Garcia",
        songTitle: "Bohemian Rhapsody",
        songArtist: "Queen",
        albumName: "A Night at the Opera",
        albumImage: require("../../assets/images/good-kid.jpeg"),
        songTimestamp: "1:45 / 5:55",
        isListeningNow: true,
      },
    ];
    setFriends(mockData);
  };

  const fetchRecentReviews = async () => {
    // TODO: Connect to backend API for friends' reviews
    // For now, using mock data
    const mockReviews = [
      {
        id: 1,
        profileImage: require("../../assets/images/profile-image.jpg"),
        username: "Alex Johnson",
        rating: 5,
        songImage: require("../../assets/images/album-cover.svg"),
        songTitle: "The Dark Side of the Moon",
        songArtist: "Pink Floyd",
        reviewText: "A timeless masterpiece that transcends genres and generations",
        likes: 42,
        comments: 12,
        repeats: 3,
      },
      {
        id: 2,
        profileImage: require("../../assets/images/profile-icon-9.png"),
        username: "Sergio Guerra",
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
    setRecentReviews(mockReviews);
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

  const handlePressProfile = () => {
    // TODO: Navigate to friend's profile
    setIsDetailsModalOpen(false);
    console.log("Navigate to profile:", selectedFriend?.username);
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
        onPressFriend={handlePressFriend}
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
});
