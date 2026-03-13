package com.server.pia.artists;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface artistsrepository extends JpaRepository<artists, Long> {

    // Find by exact name
    List<artists> findByName(String name);

    // Find by average rating
    List<artists> findByAverageRating(double averageRating);

    // Search artists by partial name (case-insensitive)
    @Query(value = "SELECT * FROM artists a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<artists> getArtistsByName(String name);
}
