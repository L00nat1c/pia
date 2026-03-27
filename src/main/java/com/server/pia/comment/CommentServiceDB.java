package com.server.pia.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class CommentServiceDB {
    
    @Autowired
    private CommentRepositoryDB commentRepo;

    // Get all comments
    public Object getAllComments() {
        return commentRepo.findAll();
    }

    // Get comment by ID
    public CommentDB getCommentById(long commentId) {
        return commentRepo.findById(commentId).orElse(null);
    }

    // Get comments by user ID
    public Object getCommentsByUserId(Long userId) {

        return commentRepo.findByUserId(userId);
    }
    // Get comments by review ID
    public Object getCommentsByReviewId(Long reviewId) {
        return commentRepo.findByReviewId(reviewId);
    }

    // Add new comment
    public CommentDB addComment(CommentDB comment) {
        return commentRepo.save(comment);
    }

    // Update existing comment
    public CommentDB updateComment(Long commentId, CommentDB comment) {
        comment.setCommentId(commentId);
        return commentRepo.save(comment);
    }

    // Delete comment
    public void deleteComment(Long commentId) {
        commentRepo.deleteById(commentId);
    }
}
