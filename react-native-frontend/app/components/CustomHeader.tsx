import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = () => (
  <View style={styles.container}>
    <Ionicons
      name="musical-notes-outline"
      size={24}
      color="#fff"
      style={{ marginRight: 8 }}
    />
    <Text style={styles.title}>Play It Again</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 100, // Set your desired height
    backgroundColor: "#080808", // Your background color
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
    flexDirection: "row",
    paddingLeft: 20,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomHeader;
