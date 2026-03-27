package com.server.pia.comment;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface CommentRepositoryDB extends JpaRepository<CommentDB, Long> {
    
    // Find all comments by review id
    List<CommentDB> findByReviewId(Long reviewId);

    // Find all comments by user id
    List<CommentDB> findByUserId(Long userId);

    // Search comments by partial content (case-insensitive)
    @Query(value = "SELECT * FROM comments c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<CommentDB> searchCommentsByContent(String content);


}

