package com.server.pia.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.server.pia.dto.DeezerTrackDTO;
import java.util.List;
import java.util.Map;

@Service
public class DeezerService {

    private final RestTemplate restTemplate = new RestTemplate();

    public DeezerTrackDTO searchTrack(String artist, String track) {
        String url = buildUrl(artist, track);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        return mapToDTO(response);
    }

    private String buildUrl(String artist, String track) {
        String query = String.format("artist:\"%s\" track:\"%s\"", artist, track);

        return UriComponentsBuilder
                .fromUriString("https://api.deezer.com/search")
                .queryParam("q", query)
                .build()
                .toUriString();
    }

    private DeezerTrackDTO mapToDTO(Map<String, Object> response) {
        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");

        if (data == null || data.isEmpty()) {
            throw new RuntimeException("No results from Deezer");
        }

        Map<String, Object> first = data.get(0);

        String title = (String) first.get("title");
        String preview = (String) first.get("preview");

        Map<String, Object> artistObj = (Map<String, Object>) first.get("artist");
        String artist = (String) artistObj.get("name");

        Map<String, Object> albumObj = (Map<String, Object>) first.get("album");
        String album = (String) albumObj.get("title");

        return new DeezerTrackDTO(title, artist, album, preview);
    }
}