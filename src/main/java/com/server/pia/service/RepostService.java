package com.server.pia.service;

import com.server.pia.entity.Repost;
import com.server.pia.entity.Reviews;
import com.server.pia.entity.User;
import com.server.pia.repository.RepostRepository;
import com.server.pia.repository.ReviewsRepository;
import com.server.pia.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepostService {

    private final RepostRepository repostRepository;
    private final ReviewsRepository reviewsRepository;
    private final UserRepository userRepository;

    public RepostService(
            RepostRepository repostRepository,
            ReviewsRepository reviewsRepository,
            UserRepository userRepository
    ) {
        this.repostRepository = repostRepository;
        this.reviewsRepository = reviewsRepository;
        this.userRepository = userRepository;
    }

    public Reviews addRepost(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElseThrow();
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow();

        if (review.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot repost your own review");
        }

        if (repostRepository.findByUserAndReview(user, review).isPresent()) {
            return review; // already reposted
        }

        Repost repost = new Repost();
        repost.setUser(user);
        repost.setReview(review);
        repost.setRepostedAt(LocalDate.now());
        repostRepository.save(repost);

        // Increment reposts count
        review.setRepostsCount((review.getRepostsCount() == null ? 0 : review.getRepostsCount()) + 1);
        reviewsRepository.save(review);

        return review;
    }

    public List<Reviews> getRepostsByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return repostRepository.findByUser(user).stream()
                .map(Repost::getReview)
                .collect(Collectors.toList());
    }

    public boolean hasUserReposted(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElseThrow();
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow();
        return repostRepository.findByUserAndReview(user, review).isPresent();
    }

    public long getRepostCount(Long reviewId) {
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow();
        return repostRepository.countByReview(review);
    }

    public boolean toggleRepost(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElseThrow();
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow();

        if (review.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot repost your own review");
        }

        var existingRepost = repostRepository.findByUserAndReview(user, review);
        
        if (existingRepost.isPresent()) {
            // Remove repost
            repostRepository.delete(existingRepost.get());
            review.setRepostsCount((review.getRepostsCount() == null ? 0 : review.getRepostsCount()) - 1);
            reviewsRepository.save(review);
            return false;
        } else {
            // Add repost
            Repost repost = new Repost();
            repost.setUser(user);
            repost.setReview(review);
            repost.setRepostedAt(LocalDate.now());
            repostRepository.save(repost);
            review.setRepostsCount((review.getRepostsCount() == null ? 0 : review.getRepostsCount()) + 1);
            reviewsRepository.save(review);
            return true;
        }
    }
}
