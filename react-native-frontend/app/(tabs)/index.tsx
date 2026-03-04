import { ScrollView } from "react-native";
import ReviewCard from "../components/ReviewCard";

export default function Index() {
  const reviews = [
    {
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#232323", width: "100%" }}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
    >
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
  );
}
