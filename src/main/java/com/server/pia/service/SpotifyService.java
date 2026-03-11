package com.server.pia.service;

import com.server.pia.external.SpotifyClient;
import org.springframework.stereotype.Service;

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
}