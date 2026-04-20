package com.server.pia.repository;

import com.server.pia.entity.Repost;
import com.server.pia.entity.Reviews;
import com.server.pia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepostRepository extends JpaRepository<Repost, Long> {

    List<Repost> findByUser(User user);

    Optional<Repost> findByUserAndReview(User user, Reviews review);

    long countByReview(Reviews review);
}
