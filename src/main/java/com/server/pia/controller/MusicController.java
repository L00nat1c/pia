package com.server.pia.controller;

import com.server.pia.service.MusicService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final MusicService musicService;

    public MusicController(MusicService musicService) {
        this.musicService = musicService;
    }

    @GetMapping("/trending")
    public String getTrendingMusic() {
        return musicService.getTrendingTracks();
    }

    @GetMapping("/{trackId}")
    public String getTrackById(@PathVariable String trackId) {
        return musicService.getTrackById(trackId);
    }
}