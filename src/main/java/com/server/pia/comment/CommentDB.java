package com.server.pia.comment;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

   
@Entity
@Table(name = "Comments")
public class CommentDB {
 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    //Created at
    @Column(name = "created_at")
    private String createdAt;

    //Userid
    @Column(name = "user_id", nullable = false)
    private Long userId;

    //Reviewid
    @Column(name = "review_id", nullable = false)
    private Long reviewId;

    @Column(name = "comment_text", columnDefinition = "TEXT")
    private String commentText;

    @Column(name = "rating")
    private Integer rating;


    public CommentDB() {}

    public CommentDB(Long commentId, String createdAt, Long userId, Long reviewId, String commentText, Integer rating) {
        this.commentId = commentId;
        this.createdAt = createdAt;
        this.userId = userId;
        this.reviewId = reviewId;
        this.commentText = commentText;
        this.rating = rating;
    }

    public CommentDB(String createdAt, Long userId, Long reviewId, String commentText, Integer rating) {
        this.createdAt = createdAt;
        this.userId = userId;
        this.reviewId = reviewId;
        this.commentText = commentText;
        this.rating = rating;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

}
