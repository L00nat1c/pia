package com.server.pia.artists;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface artistsrepositoryDB extends JpaRepository<artistsDB, Long> {

    // Find by exact name
    List<artistsDB> findByName(String name);

    // Find by average rating
    List<artistsDB> findByAverageRating(double averageRating);

    // Search artists by partial name (case-insensitive)
    @Query(value = "SELECT * FROM artists a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<artistsDB> getArtistsByName(String name);
}
