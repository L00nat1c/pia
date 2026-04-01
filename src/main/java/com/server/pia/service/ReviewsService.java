package com.server.pia.service;

import com.server.pia.entity.*;
import com.server.pia.repository.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ReviewsService {

    private final ReviewsRepository reviewsRepository;
    private final UserRepository userRepository;
    private final MusicRepository musicRepository;

    public ReviewsService(ReviewsRepository reviewsRepository,
                         UserRepository userRepository,
                         MusicRepository musicRepository) {
        this.reviewsRepository = reviewsRepository;
        this.userRepository = userRepository;
        this.musicRepository = musicRepository;
    }

    public Reviews addReview(Long userId, Long musicId, Integer rating, String text) {

        User user = userRepository.findById(userId).orElseThrow();
        Music music = musicRepository.findById(musicId).orElseThrow();

        Reviews review = new Reviews();
        review.setUser(user);
        review.setMusic(music);
        review.setRating(rating);
        review.setReviewText(text);

        return reviewsRepository.save(review);
    }

    public List<Reviews> getReviewsByMusic(Long musicId) {
        Music music = musicRepository.findById(musicId).orElseThrow();
        return reviewsRepository.findByMusic(music);
    }

    public List<Reviews> getReviewsByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return reviewsRepository.findByUser(user);
    }

    public List<Reviews> getFeedForUsers(List<User> users) {
        if (users.isEmpty()) {
            return Collections.emptyList();
        }

        return reviewsRepository.findByUserInOrderByReviewDateDescReviewIdDesc(users);
    }

    public Reviews getLatestReviewForUser(User user) {
        return reviewsRepository.findTopByUserOrderByReviewDateDescReviewIdDesc(user);
    }
}