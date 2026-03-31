package com.server.pia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.server.pia.dto.TrackInfoDTO;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
}