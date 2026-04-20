package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reposts")
public class Repost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repost_id")
    private Long repostId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Reviews review;

    @Column(name = "reposted_at")
    private LocalDate repostedAt;

    public Long getRepostId() {
        return repostId;
    }

    public void setRepostId(Long repostId) {
        this.repostId = repostId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Reviews getReview() {
        return review;
    }

    public void setReview(Reviews review) {
        this.review = review;
    }

    public LocalDate getRepostedAt() {
        return repostedAt;
    }

    public void setRepostedAt(LocalDate repostedAt) {
        this.repostedAt = repostedAt;
    }
}