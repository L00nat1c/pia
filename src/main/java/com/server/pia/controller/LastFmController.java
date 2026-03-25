package com.server.pia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.server.pia.dto.TrackInfoDTO;
import com.server.pia.service.LastFmService;
import com.server.pia.dto.TrackRequestDTO;

@RestController
@RequestMapping("/api/lastfm")
public class LastFmController {

    private final LastFmService lastFmService;

    public LastFmController(LastFmService lastFmService) {
        this.lastFmService = lastFmService;
    }

    @PostMapping("/track")
    public ResponseEntity<TrackInfoDTO> getTrackInfo(
            @RequestBody TrackRequestDTO request
    ) {
        return ResponseEntity.ok(
                lastFmService.getTrackInfo(
                        request.getArtist(),
                        request.getTrack()
                )
        );
    }
}