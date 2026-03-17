package com.server.pia.controller;

import java.util.List;
import com.server.pia.entity.Music;

import com.server.pia.service.TrendingService;
import com.server.pia.service.MusicService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final MusicService musicService;

    private final TrendingService trendingService;

    public MusicController(MusicService musicService, TrendingService trendingService) {
        this.musicService = musicService;
        this.trendingService = trendingService;
    }

    @GetMapping("/trending")
    public String getTrendingMusic() {
        return musicService.getTrendingTracks();
    }
    
    @GetMapping("/trending-db")
    public List<Music> getTrendingMusicFromDb() {
        return trendingService.getTrendingMusic();
    }
    
    @GetMapping("/{trackId}")
    public String getTrackById(@PathVariable String trackId) {
        return musicService.getTrackById(trackId);
    }
}