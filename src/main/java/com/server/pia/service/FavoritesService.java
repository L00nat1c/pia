package com.server.pia.service;

import com.server.pia.entity.Favorites;
import com.server.pia.repository.FavoritesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoritesService {

    private final FavoritesRepository favoritesRepository;

    public FavoritesService(FavoritesRepository favoritesRepository) {
        this.favoritesRepository = favoritesRepository;
    }

    public Favorites addFavorite(Favorites favorite) {
        return favoritesRepository.save(favorite);
    }

    public List<Favorites> getFavoritesByUser(Long userId) {
        return favoritesRepository.findByUserUserId(userId);
    }

    public List<Favorites> getAllFavorites() {
        return favoritesRepository.findAll();
    }
}