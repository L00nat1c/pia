import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import ReviewCard from "../components/ReviewCard";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { API_URL, AUTHENTICATION_ENABLED } from "../config";

// This file uses the ReviewCard component to dynamically render list of reviews. Currently hardcoded, but will connect to DB.

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      if (!AUTHENTICATION_ENABLED) {
        return;
      }

      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      try {
        const normalizedApiUrl = API_URL.startsWith("http")
          ? API_URL
          : `http://${API_URL}`;

        const res = await fetch(`${normalizedApiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          await SecureStore.deleteItemAsync("token");
          router.replace("/(auth)/login");
        }
      } catch {
        await SecureStore.deleteItemAsync("token");
        router.replace("/(auth)/login");
      }
    };

    checkAuth();
  }, []);

  const reviews = [
    {
      userId: 2,
      profileImage: require("../../assets/images/profile-icon-9.png"),
      username: "Sergio Guerra",
      rating: 5,
      songImage: require("../../assets/images/good-kid.jpeg"),
      songTitle: "good kid, m.A.A.d city",
      songArtist: "Kendrick Lamar",
      reviewText: "A cinematic journey through the streets of Compton",
      likes: 24,
      comments: 8,
      repeats: 5,
    },
    {
      userId: 3,
      profileImage: require("../../assets/images/profile-image.jpg"),
      username: "Alex Johnson",
      rating: 5,
      songImage: require("../../assets/images/album-cover.svg"),
      songTitle: "The Dark Side of the Moon",
      songArtist: "Pink Floyd",
      reviewText:
        "A timeless masterpiece that transcends genres and generations",
      likes: 42,
      comments: 12,
      repeats: 3,
    },
    {
      userId: 2,
      profileImage: require("../../assets/images/profile-icon-9.png"),
      username: "Sergio Guerra",
      rating: 5,
      songImage: require("../../assets/images/good-kid.jpeg"),
      songTitle: "good kid, m.A.A.d city",
      songArtist: "Kendrick Lamar",
      reviewText: "A cinematic journey through the streets of Compton",
      likes: 24,
      comments: 8,
      repeats: 5,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#080808", alignItems: "center" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#080808" }}>
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            profileImage={review.profileImage}
            username={review.username}
            rating={review.rating}
            songImage={review.songImage}
            songTitle={review.songTitle}
            songArtist={review.songArtist}
            reviewText={review.reviewText}
            likes={review.likes}
            comments={review.comments}
            repeats={review.repeats}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/review")}
      >
        <Ionicons name="add" size={48} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#379eff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
