package com.server.pia.external;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
}