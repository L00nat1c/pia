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
    
    @GetMapping("/spotify/{trackId}")
    public String getTrackBySpotifyId(@PathVariable String trackId) {
        return musicService.getTrackBySpotifyId(trackId);
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
    public String searchMusic(@RequestParam String q) {
        return musicService.searchTracks(q);
    }

    @GetMapping("/{musicId}/deezer-preview")
    public ResponseEntity<String> getDeezerPreview(@PathVariable Long musicId) {
        String url = musicService.refreshDeezerPreview(musicId);
        if (url == null || url.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(url);
    }

    @GetMapping("/db/{id}")
    public ResponseEntity<TrackResponseDTO> getTrackById(@PathVariable Long id) {
        return ResponseEntity.ok(musicService.getTrackById(id));
    }
}