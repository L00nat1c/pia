package com.server.pia.controller;

import com.server.pia.entity.Favorites;
import com.server.pia.service.FavoritesService;
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
    public Favorites addFavorite(@RequestBody Favorites favorite) {
        return favoritesService.addFavorite(favorite);
    }

    @GetMapping("/{userId}")
    public List<Favorites> getUserFavorites(@PathVariable Long userId) {
        return favoritesService.getFavoritesByUser(userId);
    }
}