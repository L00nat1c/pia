package com.server.pia.repository;

import com.server.pia.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MusicRepository extends JpaRepository<Music, Long> {

    @Query("""
        SELECT m
        FROM Music m
        JOIN Favorites f ON f.music.musicId = m.musicId
        GROUP BY m
        ORDER BY COUNT(f) DESC
    """)
    List<Music> findTrendingMusic();
}