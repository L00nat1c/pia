package com.server.pia.service;

import com.server.pia.external.SpotifyClient;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SpotifyService {

    private final SpotifyClient spotifyClient;

    public SpotifyService(SpotifyClient spotifyClient) {
        this.spotifyClient = spotifyClient;
    }

    public String getTrendingTracks() {
        return spotifyClient.getTrendingTracks();
    }

    public String getTrack(String trackId) {
        return spotifyClient.getTrackById(trackId);
    }

    public String searchTrack(String artist, String track) {
        return spotifyClient.searchTrack(artist, track);
    }
    
    
}