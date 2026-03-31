import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function CustomHeader() {
  const handleProfilePress = () => {
    router.push("../(tabs)/profile");
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.container}>
        {/* Mini vinyl disk logo */}
        <View style={styles.vinylLogo}>
          <View style={styles.vinylOuter}>
            <View style={styles.vinylLabel}>
              <View style={styles.vinylHole} />
            </View>
          </View>
        </View>
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
  vinylLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  vinylOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#0a0a0a",
  },
  vinylLabel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c2410c",
    justifyContent: "center",
    alignItems: "center",
  },
  vinylHole: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#080808",
  },
});
