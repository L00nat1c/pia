package com.server.pia.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Service
public class SpotifyTokenService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    private String accessToken;
    private long tokenExpirationTime = 0;

    public String getAccessToken() {

        // If token exists and not expired, reuse it
        if (accessToken != null && System.currentTimeMillis() < tokenExpirationTime) {
            return accessToken;
        }

        RestTemplate restTemplate = new RestTemplate();

        String auth = clientId + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuth);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request =
                new HttpEntity<>("grant_type=client_credentials", headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://accounts.spotify.com/api/token",
                request,
                Map.class
        );

        Map body = response.getBody();

        accessToken = (String) body.get("access_token");
        Integer expiresIn = (Integer) body.get("expires_in");

        // Convert seconds to milliseconds
        tokenExpirationTime = System.currentTimeMillis() + (expiresIn * 1000);

        return accessToken;
    }
}