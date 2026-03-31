package com.server.pia.external;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.server.pia.external.SpotifyTokenService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SpotifyClient {

    private final SpotifyTokenService tokenService;

    public SpotifyClient(SpotifyTokenService tokenService) {
        this.tokenService = tokenService;
    }

    public String getTrendingTracks() {

        String token = tokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.spotify.com/v1/search?q=top&type=track&limit=10",
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }

    public String getTrackById(String trackId) {

        String token = tokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.spotify.com/v1/tracks/" + trackId,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }

    public String searchTrack(String artist, String track) {

        String token = tokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        String query = "track:" + track + " artist:" + artist;

        String url = "https://api.spotify.com/v1/search?q=" +
                UriComponentsBuilder.fromUriString(query).build().toUriString() +
                "&type=track&limit=1";

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }

    public String searchMultipleTracks(String query) {

        String token = tokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://api.spotify.com/v1/search?q=" +
                URLEncoder.encode(query, StandardCharsets.UTF_8) +
                "&type=track&limit=5";

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }
}