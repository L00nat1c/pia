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
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.interactionText}>{likes}</Text>
        </Pressable>

        <Pressable onPress={onComment} style={styles.interactionItem}>
          <Ionicons name="chatbubble" size={20} color="#fff" />
          <Text style={styles.interactionText}>{comments}</Text>
        </Pressable>

        <Pressable onPress={onRepeat} style={styles.interactionItem}>
          <Ionicons name="repeat" size={20} color="#fff" />
          <Text style={styles.interactionText}>{repeats}</Text>
        </Pressable>

        <Pressable onPress={onShare} style={styles.interactionItem}>
          <Ionicons name="share" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

// This is like CSS. But doesn't cascade and is scoped to whatever its assigned with. So styles.card only applies to the card component, and not any other component that has a style of card.
const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "#232323",
    borderRadius: 12,
    borderColor: "#fff",
    borderWidth: 0.5,
    marginVertical: 10,
    paddingBottom: 10,
  },
  cardHeader: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cardProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  cardHeaderInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  cardProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cardStarRating: {
    flexDirection: "row",
    marginTop: 2,
  },
  cardSongPressable: {
    height: 100,
    backgroundColor: "#111",
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
    borderColor: "#fff",
    borderWidth: 0.25,
    marginTop: 5,
  },
  cardSongInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSongImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  songTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  songArtist: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 2,
  },
  cardReviewContainer: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  cardReviewText: {
    color: "#fff",
    fontSize: 12,
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
  },
});
