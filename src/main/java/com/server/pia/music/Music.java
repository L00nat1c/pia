package com.server.pia.music;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "music")
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "music_id")
    private Long musicId;

    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    @Column(nullable = false)
    private String name;

    private String description;

    private String genre;

    @Column(name = "length_seconds")
    private Integer lengthSeconds;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "spotify_id")
    private String spotifyId;

    public Music() {}

    public Music(Long musicId, Long artistId, String name, String description, String genre,
                 Integer lengthSeconds, String coverImage, Double averageRating,
                 Integer reviewCount, String createdAt, String spotifyId) {
        this.musicId = musicId;
        this.artistId = artistId;
        this.name = name;
        this.description = description;
        this.genre = genre;
        this.lengthSeconds = lengthSeconds;
        this.coverImage = coverImage;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.createdAt = createdAt;
        this.spotifyId = spotifyId;
    }

    public Music(Long artistId, String name, String description, String genre,
                 Integer lengthSeconds, String coverImage, Double averageRating,
                 Integer reviewCount, String createdAt, String spotifyId) {
        this.artistId = artistId;
        this.name = name;
        this.description = description;
        this.genre = genre;
        this.lengthSeconds = lengthSeconds;
        this.coverImage = coverImage;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.createdAt = createdAt;
        this.spotifyId = spotifyId;
    }

    public Long getMusicId() {
        return musicId;
    }

    public void setMusicId(Long musicId) {
        this.musicId = musicId;
    }

    public Long getArtistId() {
        return artistId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
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

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getLengthSeconds() {
        return lengthSeconds;
    }

    public void setLengthSeconds(Integer lengthSeconds) {
        this.lengthSeconds = lengthSeconds;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }
}