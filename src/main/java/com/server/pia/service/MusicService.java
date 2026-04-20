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
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

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

    public String getTrackBySpotifyId(String trackId) {
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

    public String refreshDeezerPreview(Long musicId) {
        Music music = musicRepository.findById(musicId)
                .orElseThrow(() -> new RuntimeException("Music not found: " + musicId));

        String existing = music.getDeezerPreviewUrl();

        // If we have a URL, check whether its hdnea signed token is still valid
        if (existing != null && !existing.isBlank() && !isDeezerUrlExpired(existing)) {
            return existing;
        }

        // Missing or expired — re-fetch from Deezer
        String artistName = music.getArtist() != null ? music.getArtist().getName() : "";
        String trackName  = music.getName();

        try {
            var deezer = deezerService.searchTrack(artistName, trackName);
            if (deezer != null && deezer.getPreviewUrl() != null) {
                music.setDeezerPreviewUrl(deezer.getPreviewUrl());
                musicRepository.save(music);
                return deezer.getPreviewUrl();
            }
        } catch (Exception e) {
            // Deezer lookup failed — return whatever we had
        }

        return existing;
    }

    private boolean isDeezerUrlExpired(String url) {
        // Signed URLs look like: ...?hdnea=exp=1775080991~acl=...
        // Parse the exp value and compare to current time
        try {
            int expIndex = url.indexOf("exp=");
            if (expIndex == -1) return false; // no token, assume permanent
            int start = expIndex + 4;
            int end = url.indexOf('~', start);
            String expStr = end == -1 ? url.substring(start) : url.substring(start, end);
            long expEpoch = Long.parseLong(expStr);
            return System.currentTimeMillis() / 1000 >= expEpoch;
        } catch (Exception e) {
            return false;
        }
    }

    private TrackResponseDTO mapToDTO(Music music) {
        TrackResponseDTO dto = new TrackResponseDTO();

        dto.setId(music.getMusicId());
        dto.setName(music.getName());
        dto.setMusicId(music.getMusicId());

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

    public List<TrackResponseDTO> searchMultipleTracks(String query) {

        String cleanQuery = query.trim();

        // Search database
        List<Music> byName = musicRepository.findByNameContainingIgnoreCase(cleanQuery);
        List<Music> byArtist = musicRepository.findByArtist_NameContainingIgnoreCase(cleanQuery);

        // Combine results (avoid duplicates)
        Set<Music> combined = new HashSet<>();
        combined.addAll(byName);
        combined.addAll(byArtist);

        List<TrackResponseDTO> results = new ArrayList<>(
                combined.stream()
                        .map(this::mapToDTO)
                        .toList()
        );
        
        // Return early if enough results found
        if (results.size() >= 5) {
            return results;
        }

        // Spotify search
        List<TrackResponseDTO> spotifyResults = searchSpotifyTracks(cleanQuery);

        results.addAll(spotifyResults);

        return results;
    }

    private List<TrackResponseDTO> searchSpotifyTracks(String query) {

        String json = spotifyService.searchMultipleTracks(query);

        List<TrackResponseDTO> results = new ArrayList<>();

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode items = mapper.readTree(json)
                    .path("tracks")
                    .path("items");

            for (JsonNode item : items) {

                TrackResponseDTO dto = new TrackResponseDTO();

                dto.setName(item.path("name").asText());
                dto.setArtist(item.path("artists").get(0).path("name").asText());
                dto.setDuration(item.path("duration_ms").asInt() / 1000);
                dto.setCoverImage(
                        item.path("album").path("images").get(0).path("url").asText()
                );

                results.add(dto);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }

    public String searchTracks(String query) {
        return spotifyService.searchMultipleTracks(query);
    }
}