import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";

import { Audio, AVPlaybackStatus } from "expo-av";
import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
//
// This is the card component that displays review based on props (like regular React).

type ReviewCardProps = {
  reviewId: number;
  profileImage: any;
  username: string;
  rating: number;
  songImage: string;
  songTitle: string;
  songArtist: string;
  reviewText: string;
  initialLikes?: number;
  initialComments?: number;
  shares?: number;
  repeats?: number;
  deezerPreviewUrl?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onPressSong?: () => void;
  onPressProfile?: () => void;
};

export default function ReviewCard({
  reviewId,
  profileImage,
  username,
  rating,
  songImage,
  songTitle,
  songArtist,
  reviewText,
  initialLikes = 0,
  initialComments = 0,
  shares = 0,
  repeats = 0,
  deezerPreviewUrl,
  onLike,
  onComment,
  onShare,
  onPressSong,
  onPressProfile,
}: ReviewCardProps) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  console.log("API_URL:", API_URL);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [repostCount, setRepostCount] = useState(repeats);
  const [isReposted, setIsReposted] = useState(false);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/liked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const liked = await response.json();
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error fetching liked status:", error);
      }
    };
    fetchLikedStatus();
  }, [reviewId]);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/likes`,
        );
        if (response.ok) {
          const count = await response.json();
          setLikesCount(count);
        }
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };
    fetchLikesCount();
  }, [reviewId]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/comments/count`,
        );
        if (response.ok) {
          const count = await response.json();
          setCommentCount(count);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };
    fetchCommentCount();
  }, [reviewId]);

  useEffect(() => {
    const fetchRepostedStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/reposted`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const reposted = await response.json();
          setIsReposted(reposted);
        }
      } catch (error) {
        console.error("Error fetching reposted status:", error);
      }
    };
    fetchRepostedStatus();
  }, [reviewId]);

  useEffect(() => {
    const fetchRepostCount = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/reposts/count`,
        );
        if (response.ok) {
          const count = await response.json();
          setRepostCount(count);
        }
      } catch (error) {
        console.error("Error fetching repost count:", error);
      }
    };
    fetchRepostCount();
  }, [reviewId]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const onPressSongImage = async () => {
    if (!deezerPreviewUrl) return;

    try {
      setIsPreviewLoading(true);

      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          if (
            status.isLoaded &&
            status.didJustFinish &&
            typeof status.durationMillis === "number"
          ) {
            await soundRef.current.setPositionAsync(0);
          }
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: deezerPreviewUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (error) {
      console.error("Error with audio playback:", error);
      setIsPlaying(false);
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // // Add this useEffect for status updates (after the existing one)
  // useEffect(() => {
  //   if (soundRef.current) {
  //     soundRef.current.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
  //       if (status.isLoaded) {
  //         setIsPlaying(status.isPlaying);
  //         if (status.didJustFinish) {
  //           // Reset when finished
  //           setIsPlaying(false);
  //           soundRef.current?.unloadAsync();
  //           soundRef.current = null;
  //         }
  //       } else if (status.error) {
  //         console.error("Playback error:", status.error);
  //         setIsPlaying(false);
  //       }
  //     });
  //   }
  // }, [soundRef.current]);

  const toggleComments = async () => {
    console.log("Toggling comments, current:", showComments);
    setShowComments(!showComments);
    if (!showComments) {
      // Fetch comments when opening
      try {
        console.log("Fetching comments for reviewId:", reviewId);
        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/comments`,
        );
        console.log("Fetch response ok:", response.ok);
        if (response.ok) {
          const comments = await response.json();
          console.log("Fetched comments:", comments);
          setCommentsList(comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const addComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCommentText),
        },
      );
      if (response.ok) {
        const newComment = await response.json();
        setCommentsList([newComment, ...commentsList]);
        setCommentCount(commentCount + 1);
        setNewCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // async function onPressSongImage() {
  //   if (!deezerPreviewUrl) {
  //     alert("No preview available for this song");
  //     return;
  //   }

  //   try {
  //     if (soundRef.current && isPlaying) {
  //       await soundRef.current.pauseAsync();
  //       setIsPlaying(false);
  //     } else if (soundRef.current) {
  //       await soundRef.current.playAsync();
  //       setIsPlaying(true);
  //     } else {
  //       console.log("Creating sound for URL:", deezerPreviewUrl);
  //       const { sound } = await Audio.Sound.createAsync(
  //         { uri: deezerPreviewUrl },
  //         { shouldPlay: true },
  //       );
  //       soundRef.current = sound;
  //       setIsPlaying(true);
  //     }
  //   } catch (error) {
  //     console.error("Error with audio playback:", error);
  //     alert("Unable to play audio. Please check your connection or try again.");
  //     setIsPlaying(false);
  //     if (soundRef.current) {
  //       soundRef.current.unloadAsync();
  //       soundRef.current = null;
  //     }
  //   }
  // }

  const handleLike = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/reviews/${reviewId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const newIsLiked = await response.json();
        setIsLiked(newIsLiked);

        // Fetch updated like count from server
        const countResponse = await fetch(
          `${API_URL}/api/reviews/${reviewId}/likes`,
        );
        if (countResponse.ok) {
          const newCount = await countResponse.json();
          setLikesCount(newCount);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleRepost = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}/repost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const newIsReposted = await response.json();
        setIsReposted(newIsReposted);

        // Fetch updated repost count from server
        const countResponse = await fetch(
          `${API_URL}/api/reviews/${reviewId}/reposts/count`,
        );
        if (countResponse.ok) {
          const newCount = await countResponse.json();
          setRepostCount(newCount);
        }
      }
    } catch (error) {
      console.error("Error toggling repost:", error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <Pressable onPress={onPressProfile}>
        <View style={styles.cardHeader}>
          <Image source={profileImage} style={styles.cardProfileIcon} />
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.cardProfileText}>{username}</Text>
            <View style={styles.cardStarRating}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= rating ? "star" : "star-outline"}
                  size={12}
                  color="gold"
                />
              ))}
            </View>
          </View>
        </View>
      </Pressable>

      {/* Song Info */}
      <Pressable style={styles.cardSongPressable} onPress={onPressSong}>
        <View style={styles.cardSongInfo}>
          <Pressable onPress={onPressSongImage}>
            <Image
              source={
                songImage
                  ? { uri: songImage }
                  : require("../../assets/images/icon.png")
              }
              style={styles.cardSongImage}
            />
            <View style={styles.playIcon}>
              {isPreviewLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={16}
                  color="#fff"
                />
              )}
            </View>
          </Pressable>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.songTitle}>{songTitle}</Text>
            <Text style={styles.songArtist}>{songArtist}</Text>
          </View>
        </View>
      </Pressable>

      {/* Review Text */}
      <View style={styles.cardReviewContainer}>
        <Text style={styles.cardReviewText}>{reviewText}</Text>
      </View>

      {/* Interaction Icons */}
      <View style={styles.interactionContainer}>
        {/* Pressable is like buttons */}
        <Pressable onPress={handleLike} style={styles.interactionItem}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? "red" : "#9b9486"}
          />
          <Text style={styles.interactionText}>{likesCount}</Text>
        </Pressable>

        <Pressable onPress={toggleComments} style={styles.interactionItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#9b9486" />
          <Text style={styles.interactionText}>{commentCount}</Text>
        </Pressable>

        <Pressable onPress={handleRepost} style={styles.interactionItem}>
          <Ionicons
            name={isReposted ? "repeat" : "repeat-outline"}
            size={20}
            color={isReposted ? "#22c55e" : "#9b9486"}
          />
          <Text style={styles.interactionText}>{repostCount}</Text>
        </Pressable>

        <Pressable onPress={onShare} style={styles.interactionItem}>
          <Ionicons name="share-outline" size={20} color="#9b9486" />
        </Pressable>
      </View>

      {/* Comments Section */}
      {showComments && (
        <View style={styles.commentsContainer}>
          {commentsList.map((comment) => (
            <View key={comment.commentId} style={styles.commentItem}>
              <Text style={styles.commentUser}>{comment.user.username}</Text>
              <Text style={styles.commentText}>{comment.commentText}</Text>
            </View>
          ))}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newCommentText}
              onChangeText={setNewCommentText}
              onSubmitEditing={addComment}
            />
            <Pressable onPress={addComment} style={styles.sendButton}>
              <Ionicons name="send" size={16} color="#c2410c" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

// This is like CSS. But doesn't cascade and is scoped to whatever its assigned with. So styles.card only applies to the card component, and not any other component that has a style of card.
const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#080808",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  cardHeaderInfo: {
    marginLeft: 12,
    justifyContent: "center",
  },
  cardProfileText: {
    color: "#e5e3e1",
    fontSize: 15,
    fontWeight: "600",
  },
  cardStarRating: {
    flexDirection: "row",
    marginTop: 3,
  },
  cardSongPressable: {
    backgroundColor: "#0f0f0f",
    borderRadius: 8,
    padding: 12,
    borderColor: "#2a2a2a",
    borderWidth: 1,
    marginBottom: 12,
  },
  cardSongInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSongImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
  },
  songTitle: {
    color: "#e7e5e2",
    fontSize: 14,
    fontWeight: "600",
  },
  songArtist: {
    color: "#88827a",
    fontSize: 13,
    marginTop: 4,
  },
  cardReviewContainer: {
    marginBottom: 12,
  },
  cardReviewText: {
    color: "#cbc6bf",
    fontSize: 14,
    lineHeight: 20,
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  interactionText: {
    color: "#9b9486",
    marginLeft: 6,
    fontSize: 13,
  },
  playIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 2,
  },
  commentsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  commentItem: {
    marginBottom: 8,
  },
  commentUser: {
    color: "#e5e3e1",
    fontSize: 12,
    fontWeight: "600",
  },
  commentText: {
    color: "#cbc6bf",
    fontSize: 14,
    marginTop: 2,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 6,
    padding: 8,
    color: "#e5e3e1",
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
});
