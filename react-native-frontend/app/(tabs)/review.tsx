import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { API_URL } from "../config";

export default function Review() {
  const { songId, title, artist, image } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = async (songId: string, rating: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          spotifyId: songId,
          rating,
          reviewText: reviewText,
        }),
      });

      if (!res.ok) {
        console.log("Failed:", res.status);
        return;
      }

      router.push("/(tabs)/profile");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post a Review</Text>
      <View style={styles.songContainer}>
        <Image source={{ uri: image }} style={styles.cardSongImage} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.songTitle}>{title}</Text>
          <Text style={styles.songArtist}>{artist}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginVertical: 15 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color="#f5c518"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.reviewInput}
        placeholder="Write your review here..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={reviewText}
        onChangeText={setReviewText}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => handleSubmitReview(songId as string, rating)}
      >
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#716a5d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewInput: {
    width: "90%",
    height: 100,
    backgroundColor: "#131516",
    borderRadius: 12,
    borderColor: "#6d675a",
    borderWidth: 0.25,
    marginTop: 20,
    padding: 10,
    color: "#fff",
    textAlignVertical: "top",
  },
  songContainer: {
    width: "90%",
    height: 100,
    backgroundColor: "#080808",
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
    borderColor: "#716a5d",
    borderWidth: 0.25,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  ardSongInfo: {
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
  container: {
    flex: 1,
    backgroundColor: "#080808",
    alignItems: "center",
  },
});
