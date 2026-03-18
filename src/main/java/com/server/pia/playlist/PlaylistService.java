package com.server.pia.playlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepo;

    // Get all playlists
    public List<Playlist> getAllPlaylists() {
        return playlistRepo.findAll();
    }

    // Get playlist by ID
    public Playlist getPlaylistById(Long playlistId) {
        return playlistRepo.findById(playlistId).orElse(null);
    }

    // Get playlists by user ID
    public List<Playlist> getPlaylistsByUserId(Long userId) {
        return playlistRepo.findByUserId(userId);
    }

    // Get playlists by name
    public List<Playlist> getPlaylistsByName(String name) {
        return playlistRepo.findByName(name);
    }

    // Add new playlist
    public Playlist addPlaylist(Playlist playlist) {
        return playlistRepo.save(playlist);
    }

    // Update existing playlist
    public Playlist updatePlaylist(Long playlistId, Playlist playlist) {
        playlist.setPlaylistId(playlistId);
        return playlistRepo.save(playlist);
    }

    // Delete playlist
    public void deletePlaylist(Long playlistId) {
        playlistRepo.deleteById(playlistId);
    }
}