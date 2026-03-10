package com.server.pia.controller;

import com.server.pia.entity.Music;
import com.server.pia.repository.MusicRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final MusicRepository musicRepository;

    public MusicController(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }

    @GetMapping
    public List<Music> getMusic() {
        return musicRepository.findAll();
    }

    @PostMapping
    public Music addMusic(@RequestBody Music music) {
        return musicRepository.save(music);
    }
}