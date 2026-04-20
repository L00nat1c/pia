package com.server.pia.repository;

import com.server.pia.entity.Likes;
import com.server.pia.entity.Reviews;
import com.server.pia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes, Long> {
    Optional<Likes> findByUserAndReview(User user, Reviews review);
    long countByReview(Reviews review);
}