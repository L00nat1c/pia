package com.server.pia.controller;

import java.util.List;
import com.server.pia.entity.Music;

import com.server.pia.service.TrendingService;
import com.server.pia.service.MusicService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.server.pia.dto.TrackRequestDTO;
import com.server.pia.dto.TrackResponseDTO;

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

    @PostMapping("/enrich")
    public ResponseEntity<TrackResponseDTO> enrichTrack(
            @RequestBody TrackRequestDTO request
    ) {
        return ResponseEntity.ok(
            musicService.getOrCreateTrack(
                request.getArtist(),
                request.getTrack()
            )
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrackResponseDTO>> searchMultipleTracks(
            @RequestParam String q
    ) {
        return ResponseEntity.ok(musicService.searchMultipleTracks(q));
    }
}