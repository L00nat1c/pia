package com.server.pia.music;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/music")
public class MusicControllerDB {

    @Autowired
    private MusicServiceDB musicService;

    // Get all music
    @GetMapping
    public Object getAllMusic() {
        return musicService.getAllMusic();
    }

    // Get music by ID
    @GetMapping("/{id}")
    public Music getMusicById(@PathVariable long id) {
        return musicService.getMusicById(id);
    }

    // Get music by name
    @GetMapping("/name/{name}")
    public Object getMusicByName(@PathVariable String name) {
        return musicService.getMusicByName(name);
    }

    // Get music by artist ID
    @GetMapping("/artist/{artistId}")
    public Object getMusicByArtistId(@PathVariable Long artistId) {
        return musicService.getMusicByArtistId(artistId);
    }

    // Get music by genre
    @GetMapping("/genre/{genre}")
    public Object getMusicByGenre(@PathVariable String genre) {
        return musicService.getMusicByGenre(genre);
    }

    // Get music by rating
    @GetMapping("/rating/{rating}")
    public Object getMusicByRating(@PathVariable double rating) {
        return musicService.getMusicByRating(rating);
    }

    // Add new music
    @PostMapping
    public Object addMusic(@RequestBody Music music) {
        return musicService.addMusic(music);
    }

    // Update music
    @PutMapping("/{id}")
    public Music updateMusic(@PathVariable Long id, @RequestBody Music music) {
        musicService.updateMusic(id, music);
        return musicService.getMusicById(id);
    }

    // Delete music
    @DeleteMapping("/{id}")
    public Object deleteMusic(@PathVariable Long id) {
        musicService.deleteMusic(id);
        return musicService.getAllMusic();
    }
}