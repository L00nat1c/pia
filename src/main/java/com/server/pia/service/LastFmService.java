package com.server.pia.service;

import com.server.pia.dto.LastFmRecentTrackDTO;
import com.server.pia.dto.TrackInfoDTO;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class LastFmService {

    @Value("${lastfm.api.key}")
    private String apiKey;

    @Value("${lastfm.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public TrackInfoDTO getTrackInfo(String artist, String track) {
        String url = buildUrl(artist, track);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        return mapToDTO(response);
    }

    public List<String> getTopTags(int limit) {
        int boundedLimit = Math.max(1, Math.min(limit, 50));

        String url = baseUrl +
                "?method=tag.getTopTags" +
                "&api_key=" + apiKey +
                "&format=json";

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("toptags")) {
            return List.of();
        }

        Map<String, Object> topTags = (Map<String, Object>) response.get("toptags");
        Object tagObject = topTags.get("tag");

        if (!(tagObject instanceof List<?> tagList)) {
            return List.of();
        }

        List<String> tags = new ArrayList<>();
        for (Object item : tagList) {
            if (!(item instanceof Map<?, ?> tagMap)) {
                continue;
            }

            Object name = tagMap.get("name");
            if (name instanceof String tagName && !tagName.isBlank()) {
                tags.add(tagName.trim());
            }

            if (tags.size() >= boundedLimit) {
                break;
            }
        }

        return tags;
    }

    private String buildUrl(String artist, String track) {
        return baseUrl +
                "?method=track.getInfo" +
                "&api_key=" + apiKey +
                "&artist=" + encode(artist) +
                "&track=" + encode(track) +
                "&format=json";
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private TrackInfoDTO mapToDTO(Map<String, Object> response) {
    Map<String, Object> track = (Map<String, Object>) response.get("track");

    String name = (String) track.get("name");
    String artist = ((Map<String, String>) track.get("artist")).get("name");

    String playcountStr = (String) track.get("playcount");

    long playcount = 0;
    if (playcountStr != null) {
        try {
            playcount = Long.parseLong(playcountStr);
        } catch (NumberFormatException e) {
            playcount = 0; // fallback
        }
    }

    List<String> tags = new ArrayList<>();
    Map<String, Object> tagsObj = (Map<String, Object>) track.get("toptags");

    if (tagsObj != null && tagsObj.get("tag") instanceof List<?>) {
        List<Map<String, Object>> tagList = (List<Map<String, Object>>) tagsObj.get("tag");

        for (Map<String, Object> tag : tagList) {
            tags.add((String) tag.get("name"));
        }
    }

    return new TrackInfoDTO(name, artist, playcount, tags);
}

    public Optional<LastFmRecentTrackDTO> getMostRecentTrack(String username) {
        if (username == null || username.trim().isEmpty()) {
            return Optional.empty();
        }

        try {
            String url = baseUrl +
                    "?method=user.getrecenttracks" +
                    "&api_key=" + apiKey +
                    "&user=" + encode(username) +
                    "&limit=1" +
                    "&format=json";

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("recenttracks")) {
                return Optional.empty();
            }

            Map<String, Object> recenttracks = (Map<String, Object>) response.get("recenttracks");
            Object trackObj = recenttracks.get("track");

            if (trackObj instanceof List<?> trackList && !trackList.isEmpty()) {
                Map<String, Object> track = (Map<String, Object>) trackList.get(0);

                LastFmRecentTrackDTO dto = new LastFmRecentTrackDTO();
                dto.setTrackName((String) track.get("name"));

                Map<String, Object> artist = (Map<String, Object>) track.get("artist");
                if (artist != null) {
                    dto.setArtistName((String) artist.get("#text"));
                }

                Map<String, Object> album = (Map<String, Object>) track.get("album");
                if (album != null) {
                    dto.setAlbumName((String) album.get("#text"));
                }

                List<Map<String, Object>> images = (List<Map<String, Object>>) track.get("image");
                if (images != null && !images.isEmpty()) {
                    // Get the largest image (usually the last one)
                    Map<String, Object> image = images.get(images.size() - 1);
                    dto.setAlbumImage((String) image.get("#text"));
                }

                String dateStr = (String) track.get("date");
                if (dateStr != null) {
                    try {
                        // Last.fm date format: "26 Dec 2023, 15:30"
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
                        LocalDateTime playedAt = LocalDateTime.parse(dateStr, formatter);
                        dto.setPlayedAt(playedAt);
                    } catch (Exception e) {
                        // If parsing fails, set to now
                        dto.setPlayedAt(LocalDateTime.now());
                    }
                }

                dto.setNowPlaying(track.containsKey("@attr"));

                return Optional.of(dto);
            }
        } catch (Exception e) {
            // Log error but don't throw
            System.err.println("Error fetching recent track for user " + username + ": " + e.getMessage());
        }

        return Optional.empty();
    }
}