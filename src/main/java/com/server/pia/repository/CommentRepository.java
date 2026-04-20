package com.server.pia.repository;

import com.server.pia.entity.Comment;
import com.server.pia.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReviewOrderByCommentDateDesc(Reviews review);
    long countByReview(Reviews review);
}