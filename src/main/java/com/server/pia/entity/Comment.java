package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Reviews review;

    @Column(name = "comment_text", nullable = false)
    private String commentText;

    @Column(name = "comment_date")
    private LocalDate commentDate;

    @PrePersist
    protected void onCreate() {
        commentDate = LocalDate.now();
    }

    public Comment() {}

    public Long getCommentId() { return commentId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Reviews getReview() { return review; }
    public void setReview(Reviews review) { this.review = review; }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }

    public LocalDate getCommentDate() { return commentDate; }
}