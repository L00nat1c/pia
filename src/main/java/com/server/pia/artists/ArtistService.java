package com.server.pia.artists;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ArtistService {

    @Autowired
    private artistsrepository artistRepo;

    // Get all artists
    public Object getAllArtists() {
        return artistRepo.findAll();
    }

    // Get artist by ID
    public artists getArtistById(long artistId) {
        return artistRepo.findById(artistId).orElse(null);
    }

    // Get artist by name
    public Object getArtistByName(String name) {
        return artistRepo.findByName(name);
    }

    // Get artist by average rating
    public Object getArtistByRating(double rating) {
        return artistRepo.findByAverageRating(rating);
    }

    // Add new artist
    public artists addArtist(artists artist) {
        return artistRepo.save(artist);
    }

    // Update existing artist
    public artists updateArtist(Long artistId, artists artist) {
    artist.setArtistId(artistId);
    return artistRepo.save(artist);
}

    // Delete artist
    public void deleteArtist(Long artistId) {
        artistRepo.deleteById(artistId);
    }
}