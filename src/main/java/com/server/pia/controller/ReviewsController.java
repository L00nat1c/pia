package com.server.pia.controller;

import com.server.pia.entity.Friends;
import com.server.pia.entity.Reviews;
import com.server.pia.dto.ReviewsRequest;
import com.server.pia.entity.User;
import com.server.pia.repository.FriendsRepository;
import com.server.pia.service.ReviewsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewsController {

    private final ReviewsService reviewsService;
    private final FriendsRepository friendsRepository;

    public ReviewsController(ReviewsService reviewsService, FriendsRepository friendsRepository) {
        this.reviewsService = reviewsService;
        this.friendsRepository = friendsRepository;
    }

    @PostMapping
    public Reviews addReview(@RequestBody ReviewsRequest request) {

        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return reviewsService.addReview(
                userId,
                request.getMusicId(),
                request.getRating(),
                request.getReviewText()
        );
    }

    @GetMapping("/music/{musicId}")
    public List<Reviews> getReviewsByMusic(@PathVariable Long musicId) {
        return reviewsService.getReviewsByMusic(musicId);
    }

    @GetMapping("/user/{userId}")
    public List<Reviews> getReviewsByUser(@PathVariable Long userId) {
        return reviewsService.getReviewsByUser(userId);
    }

    @GetMapping("/feed/me")
    public List<Reviews> getCurrentUserFeed() {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        List<User> friendUsers = friendsRepository.findByUserUserId(userId)
                .stream()
                .map(Friends::getFriendUser)
                .toList();

        return reviewsService.getFeedForUsers(friendUsers);
    }
}