package com.server.pia.repository;

import com.server.pia.entity.Reviews;
import com.server.pia.entity.Music;
import com.server.pia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewsRepository extends JpaRepository<Reviews, Long> {

    List<Reviews> findByMusic(Music music);

    List<Reviews> findByUser(User user);

    List<Reviews> findByMusicAndUser(Music music, User user);
}