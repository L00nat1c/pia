package com.server.pia.controller;

import com.server.pia.entity.Reviews;
import com.server.pia.repository.ReviewsRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewsController {

    private final ReviewsRepository reviewsRepository;

    public ReviewsController(ReviewsRepository reviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }

    @GetMapping
    public List<Reviews> getReviews() {
        return reviewsRepository.findAll();
    }

    @PostMapping
    public Reviews addReview(@RequestBody Reviews review) {
        return reviewsRepository.save(review);
    }
}