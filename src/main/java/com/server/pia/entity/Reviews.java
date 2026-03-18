package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "music_id", nullable = false)
    private Music music;

    private Integer rating;

    @Column(name = "review_text")
    private String reviewText;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    @PrePersist
    protected void onCreate() {
        reviewDate = LocalDate.now();
    }

    public Reviews() {}

    public Long getReviewId() { return reviewId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Music getMusic() { return music; }
    public void setMusic(Music music) { this.music = music; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }

    public LocalDate getReviewDate() { return reviewDate; }
}