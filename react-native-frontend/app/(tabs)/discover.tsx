import { Text, View, ScrollView, TextInput } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import TrendingCard from "../components/TrendingCard";
import { API_URL } from "@/app/config";

export default function Discover() {
  const [trendingData, setTrendingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  let title = "Trending Music";

  useEffect(() => {
    const init = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      await fetchTrending();
    };

    init();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch(`${API_URL}/api/music/trending`);
      const data = await res.json();
      setTrendingData(data);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

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

      <Text style={styles.title}>
        {searchResults
          ? `Search Results for "${searchQuery}"`
          : "Trending Music"}
      </Text>
      <View style={{ flex: 1, alignItems: "center" }}>
        {dataToRender?.tracks.items?.map((item) => (
          <TrendingCard
            key={item.id}
            id={item.id}
            rating={0}
            songImage={{ uri: item.album.images[0]?.url }}
            songTitle={item.album.name}
            songArtist={item.album.artists[0]?.name}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    backgroundColor: "#080808",
    flex: 1,
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
};
