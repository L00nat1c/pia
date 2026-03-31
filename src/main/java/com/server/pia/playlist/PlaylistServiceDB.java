package com.server.pia.playlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistServiceDB {

    @Autowired
    private PlaylistRepositoryDB playlistRepo;

    // Get all playlists
    public List<PlaylistDB> getAllPlaylists() {
        return playlistRepo.findAll();
    }

    // Get playlist by ID
    public PlaylistDB getPlaylistById(Long playlistId) {
        return playlistRepo.findById(playlistId).orElse(null);
    }

    // Get playlists by user ID
    public List<PlaylistDB> getPlaylistsByUserId(Long userId) {
        return playlistRepo.findByUserId(userId);
    }

    // Get playlists by name
    public List<PlaylistDB> getPlaylistsByName(String name) {
        return playlistRepo.findByName(name);
    }

    // Add new playlist
    public PlaylistDB addPlaylist(PlaylistDB playlist) {
        return playlistRepo.save(playlist);
    }

    // Update existing playlist
    public PlaylistDB updatePlaylist(Long playlistId, PlaylistDB playlist) {
        playlist.setPlaylistId(playlistId);
        return playlistRepo.save(playlist);
    }

    // Delete playlist
    public void deletePlaylist(Long playlistId) {
        playlistRepo.deleteById(playlistId);
    }
}