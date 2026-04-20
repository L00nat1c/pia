import {
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import TrendingCard from "../components/TrendingCard";
import { API_URL } from "@/app/config";

const GENRES = [
  { id: "all", label: "All" },
  { id: "pop", label: "Pop" },
  { id: "rock", label: "Rock" },
  { id: "hip-hop", label: "Hip-Hop" },
  { id: "r&b", label: "R&B" },
  { id: "indie", label: "Indie" },
  { id: "electronic", label: "Electronic" },
  { id: "jazz", label: "Jazz" },
  { id: "country", label: "Country" },
  { id: "classical", label: "Classical" },
];

export default function Discover() {
  const [trendingData, setTrendingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  let title = "Trending Music";

  useEffect(() => {
    const init = async () => {
      await fetchTrending();
    };

    init();
  }, []);

  const fetchTrending = async (genre = "all") => {
    try {
      setLoading(true);
      if (genre === "all") {
        const res = await fetch(`${API_URL}/api/music/trending`);
        const data = await res.json();
        setTrendingData(data);
      } else {
        // Search for genre-specific trending tracks
        const res = await fetch(
          `${API_URL}/api/music/search?q=${encodeURIComponent(`genre:${genre}`)}`,
        );
        const data = await res.json();
        setTrendingData(data);
      }
    } catch (error) {
      console.error("Error fetching trending data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setSearchResults(null);
    fetchTrending(genreId);
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/music/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      setSearchResults(data);
      title = "Search Results for '" + searchQuery + "'";
    } catch (error) {
      console.error("Error searching music:", error);
    }
  };

  const dataToRender = searchResults || trendingData;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search music..."
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      {!searchResults && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreContainer}
        >
          {GENRES.map((genre) => (
            <Pressable
              key={genre.id}
              onPress={() => handleGenreSelect(genre.id)}
              style={[
                styles.genreButton,
                selectedGenre === genre.id && styles.genreButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.genreButtonText,
                  selectedGenre === genre.id && styles.genreButtonTextActive,
                ]}
              >
                {genre.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Text style={styles.title}>
        {searchResults
          ? `Search Results for "${searchQuery}"`
          : "Trending Music"}
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c2410c" />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          {dataToRender?.tracks.items?.map((item) => (
            <TrendingCard
              key={item.id}
              id={item.id}
              rating={0}
              songImage={{ uri: item.album.images[0]?.url }}
              songTitle={item.name}
              songArtist={item.artists[0]?.name}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  container: {
    backgroundColor: "#080808",
    flex: 1,
  },
  loadingContainer: {
    paddingTop: 60,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: "#958d80",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    color: "#fff",
    margin: 20,
  },
  genreContainer: {
    maxHeight: 50,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  genreButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#958d80",
  },
  genreButtonActive: {
    backgroundColor: "#c2410c",
    borderColor: "#c2410c",
  },
  genreButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  genreButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
};
