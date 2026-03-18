import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import { useEffect, useRef } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

type Friend = {
  id: number;
  profileImage: any;
  username: string;
  songTitle: string;
  songArtist: string;
  isListeningNow: boolean;
};

type FriendsDrawerProps = {
  visible: boolean;
  onClose: () => void;
  friends: Friend[];
  onPressFriend: (friend: Friend) => void;
};

export default function FriendsDrawer({
  visible,
  onClose,
  friends,
  onPressFriend,
}: FriendsDrawerProps) {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > DRAWER_WIDTH * 0.3 || gestureState.vx > 0.5) {
          closeDrawer();
        } else {
          openDrawer();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [visible]);

  const openDrawer = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Overlay - tapping closes drawer */}
      <Pressable style={styles.overlay} onPress={closeDrawer} />

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Friends</Text>
          <Pressable onPress={closeDrawer} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#e5e3e1" />
          </Pressable>
        </View>

        {/* Friends list */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Pressable
                key={friend.id}
                style={styles.friendItem}
                onPress={() => onPressFriend(friend)}
              >
                <Image source={friend.profileImage} style={styles.profileImage} />
                <View style={styles.friendInfo}>
                  <Text style={styles.username}>{friend.username}</Text>
                  {friend.isListeningNow ? (
                    <>
                      <View style={styles.listeningIndicator}>
                        <Ionicons name="musical-notes" size={10} color="#1DB954" />
                        <Text style={styles.songTitle} numberOfLines={1}>
                          {friend.songTitle}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.offlineText}>Offline</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#3a3a3a" />
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptyText}>No friends online</Text>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#0f0f0f",
    borderLeftWidth: 1,
    borderLeftColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerTitle: {
    color: "#e5e3e1",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    color: "#e5e3e1",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  songTitle: {
    color: "#1DB954",
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  offlineText: {
    color: "#88827a",
    fontSize: 12,
  },
  emptyText: {
    color: "#88827a",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
});
