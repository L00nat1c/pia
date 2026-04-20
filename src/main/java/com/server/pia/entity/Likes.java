package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "likes")
public class Likes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Reviews review;

    @Column(name = "like_date")
    private LocalDate likeDate;

    @PrePersist
    protected void onCreate() {
        likeDate = LocalDate.now();
    }

    public Likes() {}

    public Long getLikeId() { return likeId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Reviews getReview() { return review; }
    public void setReview(Reviews review) { this.review = review; }

    public LocalDate getLikeDate() { return likeDate; }
}