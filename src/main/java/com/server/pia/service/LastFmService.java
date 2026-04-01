package com.server.pia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.server.pia.dto.TrackInfoDTO;
import com.server.pia.dto.LastFmRecentTrackDTO;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

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

    public Optional<LastFmRecentTrackDTO> getMostRecentTrack(String username) {
        if (username == null || username.isBlank()) {
            return Optional.empty();
        }

        String url = baseUrl +
                "?method=user.getrecenttracks" +
                "&api_key=" + apiKey +
                "&user=" + encode(username.trim()) +
                "&limit=1" +
                "&extended=0" +
                "&format=json";

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return mapRecentTrack(response);
        } catch (Exception e) {
            return Optional.empty();
        }
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

    private Optional<LastFmRecentTrackDTO> mapRecentTrack(Map<String, Object> response) {
        if (response == null) {
            return Optional.empty();
        }

        Object recentTracksObj = response.get("recenttracks");
        if (!(recentTracksObj instanceof Map<?, ?> recentTracksMap)) {
            return Optional.empty();
        }

        Object trackObj = recentTracksMap.get("track");
        Map<String, Object> track = null;

        if (trackObj instanceof List<?> trackList && !trackList.isEmpty()) {
            Object firstTrack = trackList.get(0);
            if (firstTrack instanceof Map<?, ?> firstTrackMap) {
                track = (Map<String, Object>) firstTrackMap;
            }
        } else if (trackObj instanceof Map<?, ?> trackMap) {
            track = (Map<String, Object>) trackMap;
        }

        if (track == null) {
            return Optional.empty();
        }

        LastFmRecentTrackDTO dto = new LastFmRecentTrackDTO();
        dto.setTrackName(getString(track.get("name")));

        Object artistObj = track.get("artist");
        if (artistObj instanceof Map<?, ?> artistMap) {
            dto.setArtistName(getString(artistMap.get("#text")));
        }

        Object albumObj = track.get("album");
        if (albumObj instanceof Map<?, ?> albumMap) {
            dto.setAlbumName(getString(albumMap.get("#text")));
        }

        Object imageObj = track.get("image");
        if (imageObj instanceof List<?> imageList) {
            String bestImage = null;
            for (Object imageItem : imageList) {
                if (imageItem instanceof Map<?, ?> imageMap) {
                    String imageUrl = getString(imageMap.get("#text"));
                    if (imageUrl != null && !imageUrl.isBlank()) {
                        bestImage = imageUrl;
                    }
                }
            }
            dto.setAlbumImage(bestImage);
        }

        Object dateObj = track.get("date");
        if (dateObj instanceof Map<?, ?> dateMap) {
            String uts = getString(dateMap.get("uts"));
            if (uts != null && !uts.isBlank()) {
                try {
                    dto.setPlayedAt(Instant.ofEpochSecond(Long.parseLong(uts)).toString());
                } catch (NumberFormatException ignored) {
                    dto.setPlayedAt(null);
                }
            }
        }

        Object attrObj = track.get("@attr");
        if (attrObj instanceof Map<?, ?> attrMap) {
            String nowPlaying = getString(attrMap.get("nowplaying"));
            dto.setNowPlaying("true".equalsIgnoreCase(nowPlaying));
        }

        return Optional.of(dto);
    }

    private String getString(Object value) {
        return value == null ? null : String.valueOf(value);
    }
}