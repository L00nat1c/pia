package com.server.pia.controller;

import com.server.pia.dto.FollowCountsDTO;
import com.server.pia.dto.FollowStatusDTO;
import com.server.pia.dto.FollowUserDTO;
import com.server.pia.dto.FriendActivityDTO;
import com.server.pia.service.FriendsService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendsController {

    private final FriendsService friendsService;

    public FriendsController(FriendsService friendsService) {
        this.friendsService = friendsService;
    }

    @GetMapping("/activity/me")
    public List<FriendActivityDTO> getCurrentUserFriendActivity() {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return friendsService.getFriendActivityForUser(userId);
    }

    @PostMapping("/follow/{targetUserId}")
    public FollowStatusDTO followUser(@PathVariable Long targetUserId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        friendsService.followUser(userId, targetUserId);
        return new FollowStatusDTO(true);
    }

    @DeleteMapping("/follow/{targetUserId}")
    public FollowStatusDTO unfollowUser(@PathVariable Long targetUserId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        friendsService.unfollowUser(userId, targetUserId);
        return new FollowStatusDTO(false);
    }

    @GetMapping("/is-following/{targetUserId}")
    public FollowStatusDTO isFollowing(@PathVariable Long targetUserId) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return new FollowStatusDTO(friendsService.isFollowing(userId, targetUserId));
    }

    @GetMapping("/counts/{userId}")
    public FollowCountsDTO getFollowCounts(@PathVariable Long userId) {
        return new FollowCountsDTO(
                friendsService.getFollowingCount(userId),
                friendsService.getFollowersCount(userId)
        );
    }

    @GetMapping("/following/{userId}")
    public List<FollowUserDTO> getFollowingUsers(@PathVariable Long userId) {
        return friendsService.getFollowingUsers(userId);
    }

    @GetMapping("/followers/{userId}")
    public List<FollowUserDTO> getFollowerUsers(@PathVariable Long userId) {
        return friendsService.getFollowerUsers(userId);
    }
}