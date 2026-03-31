package com.server.pia.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepositoryDB extends JpaRepository<PlaylistDB, Long> {

    // Find playlists by exact name
    List<PlaylistDB> findByName(String name);

    // Find playlists by user ID
    List<PlaylistDB> findByUserId(Long userId);

    // Search playlists by partial name (case-insensitive)
    @Query(value = "SELECT * FROM playlists p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<PlaylistDB> getPlaylistsByName(String name);
}