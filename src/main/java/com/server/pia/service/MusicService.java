package com.server.pia.service;

import org.springframework.stereotype.Service;
import com.server.pia.repository.MusicRepository;
import com.server.pia.repository.ArtistRepository;
import com.server.pia.service.SpotifyService;
import com.server.pia.service.LastFmService;
import com.server.pia.service.DeezerService;
import com.server.pia.entity.Music;
import com.server.pia.entity.Artist;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MusicService {

    private final SpotifyService spotifyService;
    private final MusicRepository musicRepository;
    private final LastFmService lastFmService;
    private final DeezerService deezerService;
    private final ArtistRepository artistRepository;

    public MusicService(
            MusicRepository musicRepository,
            SpotifyService spotifyService,
            LastFmService lastFmService,
            DeezerService deezerService,
            ArtistRepository artistRepository
    ) {
        this.musicRepository = musicRepository;
        this.spotifyService = spotifyService;
        this.lastFmService = lastFmService;
        this.deezerService = deezerService;
        this.artistRepository = artistRepository;
    }

    public String getTrendingTracks() {
        return spotifyService.getTrendingTracks();
    }

    public String getTrackById(String trackId) {
        return spotifyService.getTrack(trackId);
    }

    private String extractSpotifyId(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

            JsonNode items = root.path("tracks").path("items");

            if (items.isArray() && items.size() > 0) {
                return items.get(0).path("id").asText();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private String extractCoverImage(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

            JsonNode images = root.path("tracks")
                                .path("items")
                                .get(0)
                                .path("album")
                                .path("images");

            if (images.isArray() && images.size() > 0) {
                return images.get(0).path("url").asText();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Integer extractDuration(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

            int ms = root.path("tracks")
                        .path("items")
                        .get(0)
                        .path("duration_ms")
                        .asInt();

            // convert to seconds
            return ms / 1000; 

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Music getOrCreateTrack(String artistName, String trackName) {

        // Spotify search
        String spotifyJson = spotifyService.searchTrack(artistName, trackName);
        String spotifyId = extractSpotifyId(spotifyJson);

        // Check if music track is in database
        if (spotifyId != null) {
            var existing = musicRepository.findBySpotifyId(spotifyId);
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        // Fallback check
        var existingByName =
                musicRepository.findByNameIgnoreCaseAndArtist_NameIgnoreCase(trackName, artistName);

        if (existingByName.isPresent()) {
            return existingByName.get();
        }

        // Call other APIs
        var lastfm = lastFmService.getTrackInfo(artistName, trackName);
        var deezer = deezerService.searchTrack(artistName, trackName);

        // Get artist from database or create a new one
        Artist artist = artistRepository.findByNameIgnoreCase(artistName)
                .orElseGet(() -> {
                    Artist newArtist = new Artist();
                    newArtist.setName(artistName);
                    return artistRepository.save(newArtist);
                });

        // Build Music entity
        Music music = new Music();
        music.setName(trackName);
        music.setArtist(artist);
        music.setCover_image(extractCoverImage(spotifyJson));
        music.setLength_seconds(extractDuration(spotifyJson));

        if (spotifyId != null) {
            music.setSpotifyId(spotifyId);
        }

        if (lastfm != null) {
            music.setLastfmPlaycount(lastfm.getPlaycount());
            music.setTags(lastfm.getTags());
        }

        if (deezer != null) {
            music.setDeezerPreviewUrl(deezer.getPreviewUrl());
        }

        return musicRepository.save(music);
    }
}