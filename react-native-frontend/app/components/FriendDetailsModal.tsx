import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { formatActivityTimeLabel } from "@/app/utils/activityTime";

type FriendDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  profileImage: any;
  username: string;
  songTitle: string;
  songArtist: string;
  albumName?: string;
  albumImage?: any;
  songTimestamp?: string;
  isListeningNow: boolean;
  reviewDate?: string;
  onPressProfile?: () => void;
};

export default function FriendDetailsModal({
  visible,
  onClose,
  profileImage,
  username,
  songTitle,
  songArtist,
  albumName = "Unknown Album",
  albumImage,
  songTimestamp,
  isListeningNow,
  reviewDate,
  onPressProfile,
}: FriendDetailsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Close button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#e5e3e1" />
          </Pressable>

          {/* User info */}
          <TouchableOpacity
            style={styles.userSection}
            onPress={onPressProfile}
            activeOpacity={0.7}
          >
            <Image source={profileImage} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{username}</Text>
              {isListeningNow ? (
                <View style={styles.listeningIndicator}>
                  <Ionicons name="musical-notes" size={14} color="#c2410c" />
                  <Text style={styles.listeningText}>Listening now</Text>
                </View>
              ) : (
                <Text style={styles.offlineText}>{formatActivityTimeLabel(reviewDate)}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3a3a3a" />
          </TouchableOpacity>

          {/* Album artwork */}
          {albumImage && (
            <View style={styles.albumSection}>
              <Image source={albumImage} style={styles.albumImage} />
            </View>
          )}

          {/* Song details */}
          <View style={styles.songDetails}>
            <Text style={styles.songTitle} numberOfLines={2}>
              {songTitle || "No recent track"}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {songArtist || "No recent artist"}
            </Text>
            <Text style={styles.albumName} numberOfLines={1}>
              {albumName}
            </Text>
          </View>

          {songTimestamp ? (
            <View style={styles.timestampSection}>
              <Ionicons name="time-outline" size={16} color="#88827a" />
              <Text style={styles.timestamp}>{songTimestamp}</Text>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    padding: 20,
    borderColor: "#2a2a2a",
    borderWidth: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 30,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    color: "#e5e3e1",
    fontSize: 16,
    fontWeight: "600",
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  listeningText: {
    color: "#c2410c",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  offlineText: {
    color: "#88827a",
    fontSize: 12,
    marginTop: 4,
  },
  albumSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  albumImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  songDetails: {
    marginBottom: 16,
  },
  songTitle: {
    color: "#e7e5e2",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  songArtist: {
    color: "#cbc6bf",
    fontSize: 15,
    marginBottom: 4,
  },
  albumName: {
    color: "#88827a",
    fontSize: 13,
  },
  timestampSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  timestamp: {
    color: "#88827a",
    fontSize: 14,
    marginLeft: 8,
  },
});
