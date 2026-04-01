package com.server.pia.controller;

import com.server.pia.dto.FriendActivityDTO;
import com.server.pia.service.FriendsService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
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
}