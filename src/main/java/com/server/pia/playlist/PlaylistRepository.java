package com.server.pia.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    // Find playlists by exact name
    List<Playlist> findByName(String name);

    // Find playlists by user ID
    List<Playlist> findByUserId(Long userId);

    // Search playlists by partial name (case-insensitive)
    @Query(value = "SELECT * FROM playlists p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<Playlist> getPlaylistsByName(String name);
}