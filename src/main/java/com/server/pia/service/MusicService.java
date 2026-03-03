package com.server.pia.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.pia.dto.TrackResponse;
import com.server.pia.external.SpotifyClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MusicService {

    private final SpotifyClient spotifyClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MusicService(SpotifyClient spotifyClient) {
        this.spotifyClient = spotifyClient;
    }

    public List<TrackResponse> getTrendingTracks() throws Exception {

        String rawJson = spotifyClient.getNewReleases();

        JsonNode root = objectMapper.readTree(rawJson);
        JsonNode items = root.path("albums").path("items");

        List<TrackResponse> tracks = new ArrayList<>();

        for (JsonNode item : items) {

            String id = item.path("id").asText();
            String name = item.path("name").asText();
            String artist = item.path("artists").get(0).path("name").asText();
            String imageUrl = item.path("images").get(0).path("url").asText();

            tracks.add(new TrackResponse(
                    id,
                    name,
                    artist,
                    imageUrl,
                    null
            ));
        }

        return tracks;
    }
}