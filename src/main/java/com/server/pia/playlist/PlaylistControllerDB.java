package com.server.pia.playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/playlists")
public class PlaylistControllerDB {

    @Autowired
    private PlaylistServiceDB playlistService;

    // Get all playlists
    @GetMapping
    public List<PlaylistDB> getAllPlaylists() {
        return playlistService.getAllPlaylists();
    }

    // Get playlist by ID
    @GetMapping("/{id}")
    public PlaylistDB getPlaylistById(@PathVariable Long id) {
        return playlistService.getPlaylistById(id);
    }

    // Get playlists by user ID
    @GetMapping("/user/{userId}")
    public List<PlaylistDB> getPlaylistsByUserId(@PathVariable Long userId) {
        return playlistService.getPlaylistsByUserId(userId);
    }

    // Get playlists by name
    @GetMapping("/name/{name}")
    public List<PlaylistDB> getPlaylistsByName(@PathVariable String name) {
        return playlistService.getPlaylistsByName(name);
    }

    // Add a new playlist
    @PostMapping
    public PlaylistDB addPlaylist(@RequestBody PlaylistDB playlist) {
        return playlistService.addPlaylist(playlist);
    }

    // Update playlist
    @PutMapping("/{id}")
    public PlaylistDB updatePlaylist(@PathVariable Long id, @RequestBody PlaylistDB playlist) {
        playlistService.updatePlaylist(id, playlist);
        return playlistService.getPlaylistById(id);
    }

    // Delete playlist
    @DeleteMapping("/{id}")
    public List<PlaylistDB> deletePlaylist(@PathVariable Long id) {
        playlistService.deletePlaylist(id);
        return playlistService.getAllPlaylists();
    }
}