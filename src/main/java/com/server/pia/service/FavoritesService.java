package com.server.pia.service;

import java.time.LocalDate;
import com.server.pia.entity.User;
import com.server.pia.entity.Music;
import com.server.pia.entity.Favorites;
import com.server.pia.repository.FavoritesRepository;
import com.server.pia.repository.UserRepository;
import com.server.pia.repository.MusicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoritesService {

    private final FavoritesRepository favoritesRepository;
    private final UserRepository userRepository;
    private final MusicRepository musicRepository;

    public FavoritesService(
            FavoritesRepository favoritesRepository,
            UserRepository userRepository,
            MusicRepository musicRepository) {

        this.favoritesRepository = favoritesRepository;
        this.userRepository = userRepository;
        this.musicRepository = musicRepository;
    }

    public Favorites addFavorite(Long userId, Long musicId) {

        if (favoritesRepository.existsByUserUserIdAndMusicMusicId(userId, musicId)) {
            throw new RuntimeException("Song already favorited");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Music music = musicRepository.findById(musicId)
                .orElseThrow(() -> new RuntimeException("Music not found"));

        Favorites favorite = new Favorites();
        favorite.setUser(user);
        favorite.setMusic(music);
        favorite.setAddedAt(LocalDate.now());

        return favoritesRepository.save(favorite);
    }

    public List<Favorites> getFavoritesByUser(Long userId) {
        return favoritesRepository.findByUserUserIdOrderByAddedAtDescFavoriteIdDesc(userId);
    }

    public void removeFavorite(Long userId, Long musicId) {
        Favorites favorite = favoritesRepository.findByUserUserIdAndMusicMusicId(userId, musicId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoritesRepository.delete(favorite);
    }

    public List<Favorites> getAllFavorites() {
        return favoritesRepository.findAll();
    }
}