import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

// This is the card component that displays review based on props (like regular React).

type TrendingCardProps = {
  id: string;
  rating: number;
  songImage: any;
  songTitle: string;
  songArtist: string;
};

export default function TrendingCard({
  id,
  rating,
  songImage,
  songTitle,
  songArtist,
}: TrendingCardProps) {
  return (
    <View style={styles.card}>
      {/* Song Info */}
      <Pressable style={styles.cardSongPressable}>
        <View style={styles.cardSongInfo}>
          <Image source={songImage} style={styles.cardSongImage} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.songTitle}>{songTitle}</Text>
            <Text style={styles.songArtist}>{songArtist}</Text>
          </View>
        </View>

        {/* Leave Review */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/review",
              params: {
                songId: id,
                title: songTitle,
                artist: songArtist,
                image: songImage.uri,
              },
            })
          }
        >
          <Ionicons name="add-circle" size={32} color="#716a5d" />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
}

// This is like CSS. But doesn't cascade and is scoped to whatever its assigned with. So styles.card only applies to the card component, and not any other component that has a style of card.
const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "#131516",
    borderRadius: 12,
    borderColor: "#6d675a",
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
    paddingBottom: 12,
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
    color: "#e5e3e1",
    fontSize: 14,
    fontWeight: "600",
  },
  cardStarRating: {
    flexDirection: "row",
    marginTop: 2,
  },
  cardSongPressable: {
    height: 100,
    backgroundColor: "#080808",
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
    borderColor: "#716a5d",
    borderWidth: 0.25,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "#e7e5e2",
    fontSize: 14,
    fontWeight: "bold",
  },
  songArtist: {
    color: "#88827a",
    fontSize: 12,
    marginTop: 2,
  },
  cardReviewContainer: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  cardReviewText: {
    color: "#cbc6bf",
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
    color: "#9b9486",
    marginLeft: 5,
    fontSize: 12,
  },
});
