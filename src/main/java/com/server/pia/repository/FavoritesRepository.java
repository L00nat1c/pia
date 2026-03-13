package com.server.pia.repository;

import com.server.pia.entity.Favorites;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritesRepository extends JpaRepository<Favorites, Long> {

    List<Favorites> findByUserUserId(Long userId);
}