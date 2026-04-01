package com.server.pia.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "playlist_music")
public class PlaylistMusic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playlist_music_id;

    @ManyToOne
    @JoinColumn(name = "playlist_id")
    private Playlist playlist;

    @ManyToOne
    @JoinColumn(name = "music_id")
    private Music music;

    public PlaylistMusic() {}

    public Long getPlaylist_music_id() { return playlist_music_id; }
}