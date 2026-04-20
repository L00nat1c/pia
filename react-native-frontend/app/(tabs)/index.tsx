import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import ReviewCard from "../components/ReviewCard";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Review = {
  reviewId: number;
  user: {
    userId?: number;
    username: string;
    profileImage?: string;
    profile_picture?: string;
  };
  music: {
    musicId?: number;
    name: string;
    artist: { name: string };
    coverImage?: string;
    deezerPreviewUrl?: string;
  };
  rating: number;
  reviewText: string;
  likesCount: number;
  comments: number;
  repostsCount?: number;
};

type UserProfile = {
  preferredTags?: string[];
};

type FeedMode = "global" | "for-you";

export default function Index() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedMode, setFeedMode] = useState<FeedMode>("global");
  const [resolvedPreviewUrls, setResolvedPreviewUrls] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    fetchReviews(feedMode);
  }, [feedMode]);

  const fetchReviews = async (mode: FeedMode) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        setReviews([]);
        return;
      }

      if (mode === "for-you") {
        const userResponse = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) {
          setReviews([]);
          return;
        }

        const userData: UserProfile = await userResponse.json();
        const preferredTags = (userData.preferredTags ?? [])
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (preferredTags.length === 0) {
          setReviews([]);
          return;
        }

        const tagQuery = preferredTags
          .map((tag) => `tags=${encodeURIComponent(tag)}`)
          .join("&");

        const forYouResponse = await fetch(
          `${API_URL}/api/reviews/by-tags?${tagQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (forYouResponse.ok) {
          const data: Review[] = await forYouResponse.json();
          setReviews(data);
          resolvePreviewUrls(data, token);
        } else {
          setReviews([]);
        }

        return;
      }

      const endpoint = "/api/reviews/all";
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data: Review[] = await response.json();
        setReviews(data);
        resolvePreviewUrls(data, token);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSignedUrlExpired = (url?: string) => {
    if (!url) return true;
    const expIndex = url.indexOf("exp=");
    if (expIndex === -1) return false;
    const start = expIndex + 4;
    const end = url.indexOf("~", start);
    const expStr =
      end === -1 ? url.substring(start) : url.substring(start, end);
    const exp = Number(expStr);
    if (Number.isNaN(exp)) return false;
    return Math.floor(Date.now() / 1000) >= exp;
  };

  const resolvePreviewUrls = (data: Review[], token: string) => {
    const seen = new Set<number>();
    data.forEach((review) => {
      const musicId = review.music?.musicId;
      if (!musicId || seen.has(musicId)) return;
      seen.add(musicId);
      fetch(`${API_URL}/api/music/${musicId}/deezer-preview`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.text() : null))
        .then((url) => {
          if (url) {
            setResolvedPreviewUrls((prev) => ({ ...prev, [musicId]: url }));
          }
        })
        .catch(() => {});
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(false); // don't show full-screen spinner during pull-to-refresh
    await fetchReviews(feedMode);
    setRefreshing(false);
  };

  const content = loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#c2410c" />
    </View>
  ) : (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#080808", width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#c2410c"
        />
      }
    >
      {reviews.length > 0 ? (
        reviews
          .filter((review) => review.music?.name)
          .map((review) => (
            <ReviewCard
              key={review.reviewId}
              reviewId={review.reviewId}
              profileImage={
                review.user.profile_picture
                  ? { uri: review.user.profile_picture }
                  : review.user.profileImage
                    ? { uri: review.user.profileImage }
                    : require("../../assets/images/profile-icon-9.png")
              }
              username={review.user.username}
              rating={review.rating}
              songImage={review.music.coverImage ?? ""}
              songTitle={review.music.name}
              songArtist={review.music.artist?.name}
              reviewText={review.reviewText}
              initialLikes={review.likesCount}
              initialComments={review.comments}
              repeats={review.repostsCount || 0}
              deezerPreviewUrl={
                review.music.musicId
                  ? (resolvedPreviewUrls[review.music.musicId] ??
                    (isSignedUrlExpired(review.music.deezerPreviewUrl)
                      ? undefined
                      : review.music.deezerPreviewUrl))
                  : isSignedUrlExpired(review.music.deezerPreviewUrl)
                    ? undefined
                    : review.music.deezerPreviewUrl
              }
              onPressProfile={() =>
                router.push({
                  pathname: "/user/[id]",
                  params: { id: review.user.userId ?? 0 },
                })
              }
            />
          ))
      ) : (
        <Text style={styles.emptyText}>
          {feedMode === "for-you"
            ? "No reviews match your selected tags yet"
            : "No reviews yet"}
        </Text>
      )}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#080808" }}>
      {/* Feed toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            feedMode === "global" && styles.toggleActive,
          ]}
          onPress={() => setFeedMode("global")}
        >
          <Text
            style={[
              styles.toggleText,
              feedMode === "global" && styles.toggleTextActive,
            ]}
          >
            Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            feedMode === "for-you" && styles.toggleActive,
          ]}
          onPress={() => setFeedMode("for-you")}
        >
          <Text
            style={[
              styles.toggleText,
              feedMode === "for-you" && styles.toggleTextActive,
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  toggleActive: {
    borderBottomColor: "#c2410c",
  },
  toggleText: {
    color: "#88827a",
    fontSize: 15,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#e5e3e1",
  },
  emptyText: {
    color: "#88827a",
    marginTop: 60,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#080808",
  },
});
