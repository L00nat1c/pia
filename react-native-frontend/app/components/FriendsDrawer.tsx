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
import { formatActivityTimeLabel } from "@/app/utils/activityTime";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

type Friend = {
  id: number;
  profileImage: any;
  username: string;
  songTitle: string;
  songArtist: string;
  isListeningNow: boolean;
  reviewDate?: string;
};

type FriendsDrawerProps = {
  visible: boolean;
  onClose: () => void;
  friends: Friend[];
  onPressFriendSong: (friend: Friend) => void;
  onPressFriendProfile: (friend: Friend) => void;
};

export default function FriendsDrawer({
  visible,
  onClose,
  friends,
  onPressFriendSong,
  onPressFriendProfile,
}: FriendsDrawerProps) {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

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
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // Vinyl disk animation - moves faster than drawer to hide fully when closed
  const vinylTranslateX = translateX.interpolate({
    inputRange: [0, DRAWER_WIDTH],
    outputRange: [0, DRAWER_WIDTH * 1.98], // Moves 2.5x faster to fully hide behind drawer
  });

  return (
    <View style={styles.container} pointerEvents={visible ? "auto" : "none"}>
      {/* Overlay - tapping closes drawer */}
      <Animated.View 
        style={[
          styles.overlay, 
          { opacity: overlayOpacity }
        ]}
      >
        <Pressable style={styles.overlayPressable} onPress={closeDrawer} />
      </Animated.View>

      {/* Vinyl Disk - behind drawer, only edge peeks out - tapping closes drawer */}
      <Pressable onPress={closeDrawer} style={styles.vinylPressable}>
        <Animated.View
          style={[
            styles.vinylDisk,
            {
              transform: [{ translateX: vinylTranslateX }],
            },
          ]}
        >
          {/* Outer black vinyl */}
          <View style={styles.vinylOuter}>
            {/* Dark green label in center */}
            <View style={styles.vinylLabel}>
              {/* Center hole */}
              <View style={styles.vinylHole} />
            </View>
          </View>
        </Animated.View>
      </Pressable>

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
              <View key={friend.id} style={styles.friendItem}>
                <Image source={friend.profileImage} style={styles.profileImage} />
                <Pressable
                  style={styles.friendInfo}
                  onPress={() => onPressFriendProfile(friend)}
                >
                  <Text style={styles.username}>{friend.username}</Text>
                  {friend.isListeningNow ? (
                    <Text style={styles.profileHint}>View profile</Text>
                  ) : (
                    <Text style={styles.profileHint}>View profile</Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.songSection}
                  onPress={() => onPressFriendSong(friend)}
                >
                  <View style={styles.songMeta}>
                    <View style={styles.listeningIndicator}>
                      <Ionicons name="musical-notes" size={10} color="#c2410c" />
                      <Text style={styles.songTitle} numberOfLines={1}>
                        {friend.songTitle}
                      </Text>
                    </View>
                    <Text style={styles.offlineText} numberOfLines={1}>
                      {formatActivityTimeLabel(friend.reviewDate)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#3a3a3a" />
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No friend activity yet</Text>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayPressable: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  vinylPressable: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH, // Make pressable area cover the visible vinyl area
    zIndex: 999, // Behind drawer (1000) but above overlay
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
    zIndex: 1000, // Above vinyl disk (999)
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
    minWidth: 0,
    maxWidth: "42%",
    marginLeft: 12,
  },
  username: {
    color: "#e5e3e1",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  profileHint: {
    color: "#88827a",
    fontSize: 12,
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  songMeta: {
    flex: 1,
    minWidth: 0,
  },
  songSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 12,
  },
  songTitle: {
    color: "#c2410c",
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  offlineText: {
    color: "#88827a",
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    color: "#88827a",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
  vinylDisk: {
    position: "absolute",
    right: 0,
    top: "50%",
    marginTop: -300, // Half of 600px to center vertically
    width: 600,
    height: 600,
  },
  vinylOuter: {
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: "#1a1a1a", // Black vinyl
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0a0a0a",
    // Subtle vinyl grooves effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  vinylLabel: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#c2410c", // Dark orange label
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7c2d12",
  },
  vinylHole: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#000",
  },
});
