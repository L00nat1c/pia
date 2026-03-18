package com.server.pia.artists;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/artists")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    // Get all artists
    @GetMapping
    public Object getAllArtists() {
        return artistService.getAllArtists();
    }

    // Get artist by ID
    @GetMapping("/{id}")
    public artists getArtistById(@PathVariable long id) {
        return artistService.getArtistById(id);
    }

    // Get artist by name
    @GetMapping("/name/{name}")
    public Object getArtistByName(@PathVariable String name) {
        return artistService.getArtistByName(name);
    }

    // Get artists by average rating
    @GetMapping("/rating/{rating}")
    public Object getArtistByRating(@PathVariable double rating) {
        return artistService.getArtistByRating(rating);
    }

    // Add a new artist
    @PostMapping
    public Object addArtist(@RequestBody artists artist) {
        return artistService.addArtist(artist);
    }

    // Update artist
    @PutMapping("/{id}")
    public artists updateArtist(@PathVariable Long id, @RequestBody artists artist) {
        artistService.updateArtist(id, artist);
        return artistService.getArtistById(id);
    }

    // Delete artist
    @DeleteMapping("/{id}")
    public Object deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
        return artistService.getAllArtists();
    }
}
