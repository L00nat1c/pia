package com.server.pia.controller;

import com.server.pia.dto.TrackResponse;
import com.server.pia.service.MusicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final MusicService musicService;

    public MusicController(MusicService musicService) {
        this.musicService = musicService;
    }

    @GetMapping("/trending")
    public List<TrackResponse> getTrending() throws Exception {
        return musicService.getTrendingTracks();
    }
}