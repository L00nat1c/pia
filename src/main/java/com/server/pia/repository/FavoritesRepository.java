package com.server.pia.repository;

import com.server.pia.entity.Favorites;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritesRepository extends JpaRepository<Favorites, Long> {

    List<Favorites> findByUserUserId(Long userId);

    List<Favorites> findByUserUserIdOrderByAddedAtDescFavoriteIdDesc(Long userId);

    boolean existsByUserUserIdAndMusicMusicId(Long userId, Long musicId);

    Optional<Favorites> findByUserUserIdAndMusicMusicId(Long userId, Long musicId);

    void deleteByUserUserIdAndMusicMusicId(Long userId, Long musicId);
}