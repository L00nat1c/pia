package com.server.pia.service;

import org.springframework.stereotype.Service;

@Service
public class MusicService {

    private final SpotifyService spotifyService;

    public MusicService(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    public String getTrendingTracks() {
        return spotifyService.getTrendingTracks();
    }

    public String getTrackById(String trackId) {
        return spotifyService.getTrack(trackId);
    }
}