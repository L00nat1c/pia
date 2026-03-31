package com.server.pia.playlist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "playlists")
public class PlaylistDB {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playlist_id")
    private Long playlistId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "created_at")
    private LocalDate createdAt;

    public PlaylistDB() {}

    public PlaylistDB(Long playlistId, Long userId, String name, String description, String coverImage, LocalDate createdAt) {
        this.playlistId = playlistId;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.coverImage = coverImage;
        this.createdAt = createdAt;
    }

    public PlaylistDB(Long userId, String name, String description, String coverImage, LocalDate createdAt) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.coverImage = coverImage;
        this.createdAt = createdAt;
    }

    public Long getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(Long playlistId) {
        this.playlistId = playlistId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}