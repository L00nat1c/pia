package com.server.pia.music;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MusicServiceDB {

    @Autowired
    private MusicRepositoryDB musicRepo;

    // Get all music
    public Object getAllMusic() {
        return musicRepo.findAll();
    }

    // Get music by ID
    public MusicDB getMusicById(long musicId) {
        return musicRepo.findById(musicId).orElse(null);
    }

    // Get music by name
    public Object getMusicByName(String name) {
        return musicRepo.findByName(name);
    }

    // Get music by artist ID
    public Object getMusicByArtistId(Long artistId) {
        return musicRepo.findByArtistId(artistId);
    }

    // Get music by genre
    public Object getMusicByGenre(String genre) {
        return musicRepo.findByGenre(genre);
    }

    // Get music by rating
    public Object getMusicByRating(double rating) {
        return musicRepo.findByAverageRating(rating);
    }

    // Add new music
    public MusicDB addMusic(MusicDB music) {
        return musicRepo.save(music);
    }

    // Update existing music
    public MusicDB updateMusic(Long musicId, MusicDB music) {
        music.setMusicId(musicId);
        return musicRepo.save(music);
    }

    // Delete music
    public void deleteMusic(Long musicId) {
        musicRepo.deleteById(musicId);
    }
}