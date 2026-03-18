import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type CurrentlyListeningCardProps = {
  profileImage: any;
  username: string;
  songTitle: string;
  songArtist: string;
  isListeningNow: boolean;
  timeAgo?: string; // e.g., "5 minutes ago"
  onPressUser?: () => void;
  onPressSong?: () => void;
};

export default function CurrentlyListeningCard({
  profileImage,
  username,
  songTitle,
  songArtist,
  isListeningNow,
  timeAgo,
  onPressUser,
  onPressSong,
}: CurrentlyListeningCardProps) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPressUser} style={styles.userSection}>
        <Image source={profileImage} style={styles.profileIcon} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          {isListeningNow ? (
            <View style={styles.listeningIndicator}>
              <Ionicons name="musical-notes" size={12} color="#1DB954" />
              <Text style={styles.listeningText}>Listening now</Text>
            </View>
          ) : (
            timeAgo && <Text style={styles.timeAgoText}>{timeAgo}</Text>
          )}
        </View>
      </Pressable>

      <Pressable onPress={onPressSong} style={styles.songSection}>
        <Ionicons name="musical-note" size={24} color="#9b9486" />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {songTitle}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {songArtist}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#3a3a3a" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#080808",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    color: "#e5e3e1",
    fontSize: 14,
    fontWeight: "600",
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  listeningText: {
    color: "#1DB954",
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "500",
  },
  timeAgoText: {
    color: "#88827a",
    fontSize: 11,
    marginTop: 2,
  },
  songSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 10,
    borderRadius: 8,
    borderColor: "#2a2a2a",
    borderWidth: 1,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: "#e7e5e2",
    fontSize: 13,
    fontWeight: "600",
  },
  songArtist: {
    color: "#88827a",
    fontSize: 12,
    marginTop: 2,
  },
});
