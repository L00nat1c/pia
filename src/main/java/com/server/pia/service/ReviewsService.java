package com.server.pia.service;

import com.server.pia.entity.*;
import com.server.pia.repository.*;
import org.springframework.stereotype.Service;
import com.server.pia.dto.TrackResponseDTO;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReviewsService {

    private final ReviewsRepository reviewsRepository;
    private final UserRepository userRepository;
    private final MusicRepository musicRepository;
    private final MusicService musicService;

    public ReviewsService(ReviewsRepository reviewsRepository,
                         UserRepository userRepository,
                         MusicRepository musicRepository,
                         MusicService musicService) {
        this.reviewsRepository = reviewsRepository;
        this.userRepository = userRepository;
        this.musicRepository = musicRepository;
        this.musicService = musicService;
    }

    public Reviews addReview(Long userId, String artistName, String trackName, Integer rating, String text) {

        User user = userRepository.findById(userId).orElseThrow();

        TrackResponseDTO trackDTO = musicService.getOrCreateTrack(artistName, trackName);

        Music music = musicRepository.findById(trackDTO.getMusicId()).orElseThrow();

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

    public List<Reviews> getAllReviews() {
        return reviewsRepository.findAllByOrderByReviewDateDesc();
    }

    public Reviews getLatestReviewForUser(User user) {
        return reviewsRepository.findFirstByUserOrderByReviewDateDesc(user).orElse(null);
    }

    public List<Reviews> getFollowingReviews(List<User> followedUsers) {
        if (followedUsers == null || followedUsers.isEmpty()) {
            return List.of();
        }
        return reviewsRepository.findByUserInOrderByReviewDateDesc(followedUsers);
    }

    public List<Reviews> getReviewsByTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return List.of();
        }

        Set<String> normalizedTags = tags.stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .flatMap(tag -> Arrays.stream(tag.split(",")))
                .map(String::trim)
                .filter(tag -> !tag.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        if (normalizedTags.isEmpty()) {
            return List.of();
        }

        return reviewsRepository.findByMusicTagsInOrderByReviewDateDesc(normalizedTags);
    }

    public void deleteReview(Long userId, Long reviewId) {
        Reviews review = reviewsRepository.findById(reviewId).orElseThrow();
        if (!review.getUser().getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not allowed to delete this review");
        }
        reviewsRepository.delete(review);
    }
}