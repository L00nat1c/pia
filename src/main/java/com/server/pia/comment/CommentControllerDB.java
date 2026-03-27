package com.server.pia.comment;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/comments")
public class CommentControllerDB {
    
    @Autowired
    private CommentServiceDB commentService;

    // Get all comments
    @GetMapping
    public Object getAllComments() {
        return commentService.getAllComments();
    }

    // Get comment by ID
    @GetMapping("/{id}")
    public CommentDB getCommentById(@PathVariable long id) {
        return commentService.getCommentById(id);
    }

    // Get comments by review ID
    @GetMapping("/review/{reviewId}")
    public Object getCommentsByReviewId(@PathVariable Long reviewId) {
        return commentService.getCommentsByReviewId(reviewId);
    }

    // Get comments by user ID
    @GetMapping("/user/{userId}")
    public Object getCommentsByUserId(@PathVariable Long userId) {
        return commentService.getCommentsByUserId(userId);
    }

    // Add new comment
    @PostMapping
    public Object addComment(@RequestBody CommentDB comment) {
        return commentService.addComment(comment);
    }

    // Update existing comment
    @PutMapping("/{id}")
    public CommentDB updateComment(@PathVariable Long id, @RequestBody CommentDB comment) {
        return commentService.updateComment(id, comment);
    }

    // Delete comment
    @DeleteMapping("/{id}")
    public Object deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return commentService.getAllComments();
    }
}
