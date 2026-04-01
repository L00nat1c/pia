package com.server.pia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.server.pia.dto.DeezerTrackDTO;
import com.server.pia.dto.DeezerRequestDTO;
import com.server.pia.service.DeezerService;

@RestController
@RequestMapping("/api/deezer")
public class DeezerController {

    private final DeezerService deezerService;

    public DeezerController(DeezerService deezerService) {
        this.deezerService = deezerService;
    }

    @PostMapping("/track")
    public ResponseEntity<DeezerTrackDTO> searchTrack(
            @RequestBody DeezerRequestDTO request
    ) {
        return ResponseEntity.ok(
                deezerService.searchTrack(
                        request.getArtist(),
                        request.getTrack()
                )
        );
    }
}