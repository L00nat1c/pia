package com.server.pia.controller;

import com.server.pia.entity.Favorites;
import com.server.pia.dto.FavoriteRequest;
import com.server.pia.service.FavoritesService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {

    private final FavoritesService favoritesService;

    public FavoritesController(FavoritesService favoritesService) {
        this.favoritesService = favoritesService;
    }

    @PostMapping
    public Favorites addFavorite(@RequestBody FavoriteRequest request) {

        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return favoritesService.addFavorite(userId, request.getMusicId());
    }

    @DeleteMapping("/{musicId}")
    public void removeFavorite(@PathVariable Long musicId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        favoritesService.removeFavorite(userId, musicId);
    }

    @GetMapping("/me")
    public List<Favorites> getUserFavorites() {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
                
        return favoritesService.getFavoritesByUser(userId);
    }

    @GetMapping("/user/{userId}")
    public List<Favorites> getFavoritesForUser(@PathVariable Long userId) {
        return favoritesService.getFavoritesByUser(userId);
    }
}