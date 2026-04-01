package com.server.pia.repository;

import com.server.pia.entity.Friends;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendsRepository extends JpaRepository<Friends, Long> {
	List<Friends> findByUserUserId(Long userId);

	List<Friends> findByFriendUserUserId(Long userId);

	boolean existsByUserUserIdAndFriendUserUserId(Long userId, Long friendUserId);

	void deleteByUserUserIdAndFriendUserUserId(Long userId, Long friendUserId);

	long countByUserUserId(Long userId);

	long countByFriendUserUserId(Long userId);
}