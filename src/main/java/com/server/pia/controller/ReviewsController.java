package com.server.pia.controller;

import com.server.pia.entity.Reviews;
import com.server.pia.dto.ReviewsRequest;
import com.server.pia.service.ReviewsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewsController {

    private final ReviewsService reviewsService;

    public ReviewsController(ReviewsService reviewsService) {
        this.reviewsService = reviewsService;
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
}