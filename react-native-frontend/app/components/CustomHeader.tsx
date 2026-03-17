import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CustomHeader() {
  const handleProfilePress = () => {
    router.push("../(tabs)/profile");
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.container}>
        <Ionicons
          name="musical-notes-outline"
          size={24}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.title}>Play It Again</Text>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfilePress}
      >
        <Image
          source={require("../../assets/images/profile-icon-9.png")}
          style={{ width: 25, height: 25, borderRadius: 12.5 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    height: 100, // Set your desired height
    backgroundColor: "#080808", // Your background color
    justifyContent: "space-between",
    paddingTop: 60,
    paddingRight: 20,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileButton: {
    width: 25,
    height: 25,
  },
});
