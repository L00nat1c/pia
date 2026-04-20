package com.server.pia.service;

import com.server.pia.entity.Likes;
import com.server.pia.entity.Reviews;
import com.server.pia.entity.User;
import com.server.pia.repository.LikesRepository;
import com.server.pia.repository.ReviewsRepository;
import com.server.pia.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class LikesService {

    private final LikesRepository likesRepository;
    private final ReviewsRepository reviewsRepository;
    private final UserRepository userRepository;

    public LikesService(LikesRepository likesRepository, ReviewsRepository reviewsRepository, UserRepository userRepository) {
        this.likesRepository = likesRepository;
        this.reviewsRepository = reviewsRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean toggleLike(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));

        Optional<Likes> existingLike = likesRepository.findByUserAndReview(user, review);

        if (existingLike.isPresent()) {
            // Unlike
            likesRepository.delete(existingLike.get());
            review.setLikesCount(review.getLikesCount() - 1);
            reviewsRepository.save(review);
            return false; // not liked
        } else {
            // Like
            Likes like = new Likes();
            like.setUser(user);
            like.setReview(review);
            likesRepository.save(like);
            review.setLikesCount(review.getLikesCount() + 1);
            reviewsRepository.save(review);
            return true; // liked
        }
    }

    public long getLikesCount(Long reviewId) {
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        return likesRepository.countByReview(review);
    }

    public boolean hasUserLiked(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        return likesRepository.findByUserAndReview(user, review).isPresent();
    }
}