package com.server.pia.service;

import com.server.pia.entity.Comment;
import com.server.pia.entity.Reviews;
import com.server.pia.entity.User;
import com.server.pia.repository.CommentRepository;
import com.server.pia.repository.ReviewsRepository;
import com.server.pia.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewsRepository reviewsRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, ReviewsRepository reviewsRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.reviewsRepository = reviewsRepository;
        this.userRepository = userRepository;
    }

    public Comment addComment(Long userId, Long reviewId, String text) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setReview(review);
        comment.setCommentText(text);

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByReview(Long reviewId) {
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        return commentRepository.findByReviewOrderByCommentDateDesc(review);
    }

    public long getCommentCount(Long reviewId) {
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        return commentRepository.countByReview(review);
    }
}