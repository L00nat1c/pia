package com.server.pia.artists;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "artists")
public class artistsDB {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artist_id")
    private Long artistId;

    @Column(nullable = false)
    private String name;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "total_review_count")
    private Integer totalReviewCount;

    public artistsDB() {}

    public artistsDB(Long artistId, String name, Double averageRating, Integer totalReviewCount) {
        this.artistId = artistId;
        this.name = name;
        this.averageRating = averageRating;
        this.totalReviewCount = totalReviewCount;
    }

    public artistsDB(String name, Double averageRating, Integer totalReviewCount) {
        this.name = name;
        this.averageRating = averageRating;
        this.totalReviewCount = totalReviewCount;
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

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviewCount() {
        return totalReviewCount;
    }

    public void setTotalReviewCount(Integer totalReviewCount) {
        this.totalReviewCount = totalReviewCount;
    }
}
