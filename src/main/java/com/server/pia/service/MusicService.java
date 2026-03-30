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
import com.server.pia.dto.TrackResponseDTO;

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

    public TrackResponseDTO getOrCreateTrack(String artistName, String trackName) {

        // Trim the artist and track name / delete extra spaces
        String cleanArtist = artistName.trim();
        String cleanTrack = trackName.trim();

        // Spotify search
        String spotifyJson = spotifyService.searchTrack(cleanArtist, cleanTrack);
        String spotifyId = extractSpotifyId(spotifyJson);

        // Check if music track is in database
        if (spotifyId != null) {
            var existing = musicRepository.findBySpotifyId(spotifyId);
            if (existing.isPresent()) {
                return mapToDTO(existing.get());
            }
        }

        // Fallback check
        var existingByName =
                musicRepository.findByNameIgnoreCaseAndArtist_NameIgnoreCase(trackName, artistName);

        if (existingByName.isPresent()) {
            return mapToDTO(existingByName.get());
        }

        // Call other APIs
        var lastfm = lastFmService.getTrackInfo(cleanArtist, cleanTrack);
        var deezer = deezerService.searchTrack(cleanArtist, cleanTrack);

        

        // Get artist from database or create a new one
        Artist artist = artistRepository.findByNameIgnoreCase(cleanArtist)
                .orElseGet(() -> {
                    Artist newArtist = new Artist();
                    newArtist.setName(cleanArtist);
                    return artistRepository.save(newArtist);
                });

        // Build Music entity
        Music music = new Music();
        music.setName(cleanTrack);

        music.setArtist(artist);
        
        if (spotifyJson != null) {
            music.setCoverImage(extractCoverImage(spotifyJson));
            music.setLengthSeconds(extractDuration(spotifyJson));
        }

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

        Music saved = musicRepository.save(music);
        return mapToDTO(saved);
    }

    private TrackResponseDTO mapToDTO(Music music) {
        TrackResponseDTO dto = new TrackResponseDTO();

        dto.setId(music.getMusicId());
        dto.setName(music.getName());

        if (music.getArtist() != null) {
            dto.setArtist(music.getArtist().getName());
        }

        dto.setCoverImage(music.getCoverImage());
        dto.setPreviewUrl(music.getDeezerPreviewUrl());
        dto.setDuration(music.getLengthSeconds());
        dto.setPlaycount(music.getLastfmPlaycount());
        dto.setTags(music.getTags());
        dto.setGenre(music.getGenre());

        return dto;
    }
}