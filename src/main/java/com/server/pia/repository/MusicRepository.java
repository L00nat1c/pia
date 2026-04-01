package com.server.pia.repository;

import com.server.pia.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
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

    Optional<Music> findBySpotifyId(String spotifyId);

    Optional<Music> findByNameIgnoreCaseAndArtist_NameIgnoreCase(String name, String artist);

    List<Music> findByNameContainingIgnoreCase(String name);

    List<Music> findByArtist_NameContainingIgnoreCase(String artistName);
}