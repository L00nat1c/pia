package com.server.pia.service;

import com.server.pia.entity.Music;
import com.server.pia.repository.MusicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrendingService {

    private final MusicRepository musicRepository;

    public TrendingService(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }

    public List<Music> getTrendingMusic() {
        return musicRepository.findTrendingMusic();
    }
}