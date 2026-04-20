package com.server.pia.controller;

import com.server.pia.entity.Friends;
import com.server.pia.entity.Reviews;
import com.server.pia.dto.ReviewsRequest;
import com.server.pia.entity.User;
import com.server.pia.repository.FriendsRepository;
import com.server.pia.service.ReviewsService;
import com.server.pia.service.FriendsService;
import com.server.pia.service.LikesService;
import com.server.pia.service.CommentService;
import com.server.pia.service.RepostService;
import com.server.pia.entity.Comment;
import com.server.pia.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewsController {

    private final ReviewsService reviewsService;
    private final LikesService likesService;
    private final CommentService commentService;
    private final RepostService repostService;
    private final FriendsService friendsService;
    private final UserRepository userRepository;

    public ReviewsController(ReviewsService reviewsService, LikesService likesService, CommentService commentService, RepostService repostService, FriendsService friendsService, UserRepository userRepository) {
        this.reviewsService = reviewsService;
        this.likesService = likesService;
        this.commentService = commentService;
        this.repostService = repostService;
        this.friendsService = friendsService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Reviews addReview(@RequestBody ReviewsRequest request) {

        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return reviewsService.addReview(
                userId,
                request.getArtist(),
                request.getTrack(),
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

    @PostMapping("/{reviewId}/like")
    public boolean toggleLike(@PathVariable Long reviewId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return likesService.toggleLike(userId, reviewId);
    }

    @GetMapping("/{reviewId}/likes")
    public long getLikesCount(@PathVariable Long reviewId) {
        return likesService.getLikesCount(reviewId);
    }

    @GetMapping("/{reviewId}/liked")
    public boolean hasUserLiked(@PathVariable Long reviewId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return likesService.hasUserLiked(userId, reviewId);
    }

    @PostMapping("/{reviewId}/comments")
    public Comment addComment(@PathVariable Long reviewId, @RequestBody String text) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return commentService.addComment(userId, reviewId, text);
    }

    @GetMapping("/{reviewId}/comments")
    public List<Comment> getComments(@PathVariable Long reviewId) {
        return commentService.getCommentsByReview(reviewId);
    }

    @GetMapping("/{reviewId}/comments/count")
    public long getCommentCount(@PathVariable Long reviewId) {
        return commentService.getCommentCount(reviewId);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        reviewsService.deleteReview(userId, reviewId);
    }

    @PostMapping("/{reviewId}/repost")
    public boolean repostReview(@PathVariable Long reviewId) {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        
        Long userId;
        if (principal instanceof Long) {
            userId = (Long) principal;
        } else {
            userId = Long.parseLong(principal.toString());
        }

        return repostService.toggleRepost(userId, reviewId);
    }

    @GetMapping("/{reviewId}/reposted")
    public boolean hasUserReposted(@PathVariable Long reviewId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return repostService.hasUserReposted(userId, reviewId);
    }

    @GetMapping("/{reviewId}/reposts/count")
    public long getRepostCount(@PathVariable Long reviewId) {
        return repostService.getRepostCount(reviewId);
    }

    @GetMapping("/reposts/user/{userId}")
    public List<Reviews> getRepostsByUser(@PathVariable Long userId) {
        return repostService.getRepostsByUser(userId);
    }

    @GetMapping("/all")
    public List<Reviews> getAllReviews() {
        return reviewsService.getAllReviews();
    }

    @GetMapping("/following")
    public List<Reviews> getFollowingReviews() {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return reviewsService.getFollowingReviews(
                friendsService.getFollowingUsers(userId)
                        .stream()
                        .map(dto -> userRepository.findById(dto.getUserId()).orElse(null))
                        .filter(u -> u != null)
                        .toList()
        );
    }

    @GetMapping("/by-tags")
    public List<Reviews> getReviewsByTags(@RequestParam List<String> tags) {
        return reviewsService.getReviewsByTags(tags);
    }
}