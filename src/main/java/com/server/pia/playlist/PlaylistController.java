package com.server.pia.playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    // Get all playlists
    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistService.getAllPlaylists();
    }

    // Get playlist by ID
    @GetMapping("/{id}")
    public Playlist getPlaylistById(@PathVariable Long id) {
        return playlistService.getPlaylistById(id);
    }

    // Get playlists by user ID
    @GetMapping("/user/{userId}")
    public List<Playlist> getPlaylistsByUserId(@PathVariable Long userId) {
        return playlistService.getPlaylistsByUserId(userId);
    }

    // Get playlists by name
    @GetMapping("/name/{name}")
    public List<Playlist> getPlaylistsByName(@PathVariable String name) {
        return playlistService.getPlaylistsByName(name);
    }

    // Add a new playlist
    @PostMapping
    public Playlist addPlaylist(@RequestBody Playlist playlist) {
        return playlistService.addPlaylist(playlist);
    }

    // Update playlist
    @PutMapping("/{id}")
    public Playlist updatePlaylist(@PathVariable Long id, @RequestBody Playlist playlist) {
        playlistService.updatePlaylist(id, playlist);
        return playlistService.getPlaylistById(id);
    }

    // Delete playlist
    @DeleteMapping("/{id}")
    public List<Playlist> deletePlaylist(@PathVariable Long id) {
        playlistService.deletePlaylist(id);
        return playlistService.getAllPlaylists();
    }
}