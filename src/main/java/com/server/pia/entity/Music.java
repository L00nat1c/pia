package com.server.pia.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;


@Entity
@Table(name = "music")
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "music_id")
    private Long musicId;

    private String name;

    private String description;

    private String genre;

    private Integer length_seconds;

    @Column(name = "cover_image", columnDefinition = "TEXT")
    private String cover_image;

    private Double average_rating;

    private Integer review_count;

    @Column(name = "spotify_id")
    private String spotifyId;

    @Column(name = "created_at")
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @OneToMany(mappedBy = "music")
    @JsonIgnore
    private List<Reviews> reviews;

    @Column(name = "deezer_preview_url", columnDefinition = "TEXT")
    private String deezerPreviewUrl;

    @Column(name = "lastfm_playcount")
    private Long lastfmPlaycount;

    @ElementCollection
    @CollectionTable(name = "music_tags", joinColumns = @JoinColumn(name = "music_id"))
    @Column(name = "tag")
    private List<String> tags;

    public Music() {}

    public Long getMusicId() { return musicId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Artist getArtist() { return artist; }
    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public String getSpotifyId() { return spotifyId;}
    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }

    public String getDeezerPreviewUrl() { return deezerPreviewUrl;}
    public void setDeezerPreviewUrl(String deezerPreviewUrl) {
        this.deezerPreviewUrl = deezerPreviewUrl;
    }

    public Long getLastfmPlaycount() { return lastfmPlaycount; }
    public void setLastfmPlaycount(Long lastfmPlaycount) {
        this.lastfmPlaycount = lastfmPlaycount;
    }

    public List<String> getTags() { return tags;}
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public Integer getLengthSeconds() { return length_seconds; }
    public void setLengthSeconds(Integer length_seconds) { this.length_seconds = length_seconds; }

    public String getCoverImage() { return cover_image; }
    public void setCoverImage(String cover_image) { this.cover_image = cover_image; }

    public Double getAverageRating() { return average_rating; }
    public void setAverageRating(Double average_rating) { this.average_rating = average_rating; }

    public Integer getReviewCount() { return review_count; }
    public void setReviewCount(Integer review_count) { this.review_count = review_count; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDate.now().toString(); }
}