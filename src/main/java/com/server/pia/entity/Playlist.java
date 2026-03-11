package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "playlist")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playlist_id;

    private String name;

    private String description;

    private String cover_image;

    private LocalDate created_at;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "playlist")
    @JsonIgnore
    private List<PlaylistMusic> playlistMusic;

    public Playlist() {}

    public Long getPlaylist_id() { return playlist_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}