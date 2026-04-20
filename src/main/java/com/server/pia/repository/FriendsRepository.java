package com.server.pia.repository;

import com.server.pia.entity.Friends;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FriendsRepository extends JpaRepository<Friends, Long> {

    @Query("SELECT f FROM Friends f WHERE f.user.userId = :userId")
    List<Friends> findByUserUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Friends f WHERE f.friendUser.userId = :userId")
    List<Friends> findByFriendUserUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) > 0 FROM Friends f WHERE f.user.userId = :userId AND f.friendUser.userId = :friendUserId")
    boolean existsByUserUserIdAndFriendUserUserId(@Param("userId") Long userId, @Param("friendUserId") Long friendUserId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Friends f WHERE f.user.userId = :userId AND f.friendUser.userId = :friendUserId")
    void deleteByUserUserIdAndFriendUserUserId(@Param("userId") Long userId, @Param("friendUserId") Long friendUserId);

    @Query("SELECT COUNT(f) FROM Friends f WHERE f.user.userId = :userId")
    long countByUserUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM Friends f WHERE f.friendUser.userId = :userId")
    long countByFriendUserUserId(@Param("userId") Long userId);
}