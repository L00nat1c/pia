package com.server.pia.repository;

import com.server.pia.entity.Reviews;
import com.server.pia.entity.Music;
import com.server.pia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ReviewsRepository extends JpaRepository<Reviews, Long> {

    List<Reviews> findByMusic(Music music);

    List<Reviews> findByUser(User user);

    List<Reviews> findByUserInOrderByReviewDateDescReviewIdDesc(List<User> users);

    Reviews findTopByUserOrderByReviewDateDescReviewIdDesc(User user);

    List<Reviews> findByMusicAndUser(Music music, User user);

    List<Reviews> findAllByOrderByReviewDateDesc();

    Optional<Reviews> findFirstByUserOrderByReviewDateDesc(User user);

    List<Reviews> findByUserInOrderByReviewDateDesc(List<User> users);

    @Query("""
        SELECT DISTINCT r
        FROM Reviews r
        JOIN r.music m
        JOIN m.tags t
        WHERE LOWER(t) IN :tags
        ORDER BY r.reviewDate DESC
    """)
    List<Reviews> findByMusicTagsInOrderByReviewDateDesc(@Param("tags") Set<String> tags);
}