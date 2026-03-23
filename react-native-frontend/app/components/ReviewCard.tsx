import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// This is the card component that displays review based on props (like regular React).

type ReviewCardProps = {
  profileImage: any;
  username: string;
  rating: number;
  songImage: any;
  songTitle: string;
  songArtist: string;
  reviewText: string;
  likes?: number;
  comments?: number;
  shares?: number;
  repeats?: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onRepeat?: () => void;
  onPressSong?: () => void;
};

export default function ReviewCard({
  profileImage,
  username,
  rating,
  songImage,
  songTitle,
  songArtist,
  reviewText,
  likes = 0,
  comments = 0,
  shares = 0,
  repeats = 0,
  onLike,
  onComment,
  onShare,
  onRepeat,
  onPressSong,
}: ReviewCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
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

      {/* Song Info */}
      <Pressable style={styles.cardSongPressable} onPress={onPressSong}>
        <View style={styles.cardSongInfo}>
          <Image source={songImage} style={styles.cardSongImage} />
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
        <Pressable onPress={onLike} style={styles.interactionItem}>
          <Ionicons name="heart-outline" size={20} color="#9b9486" />
          <Text style={styles.interactionText}>{likes}</Text>
        </Pressable>

        <Pressable onPress={onComment} style={styles.interactionItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#9b9486" />
          <Text style={styles.interactionText}>{comments}</Text>
        </Pressable>

        <Pressable onPress={onRepeat} style={styles.interactionItem}>
          <Ionicons name="repeat" size={20} color="#9b9486" />
          <Text style={styles.interactionText}>{repeats}</Text>
        </Pressable>

        <Pressable onPress={onShare} style={styles.interactionItem}>
          <Ionicons name="share-outline" size={20} color="#9b9486" />
        </Pressable>
      </View>
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
});
