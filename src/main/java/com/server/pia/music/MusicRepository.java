package com.server.pia.music;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {

    // Find by exact name
    List<Music> findByName(String name);

    // Find all music by artist id
    List<Music> findByArtistId(Long artistId);

    // Find by genre
    List<Music> findByGenre(String genre);

    // Find music by average rating
    List<Music> findByAverageRating(double averageRating);

    // Search music by partial name (case-insensitive)
    @Query(value = "SELECT * FROM music m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<Music> getMusicByName(String name);
}