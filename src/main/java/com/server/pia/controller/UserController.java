package com.server.pia.controller;

import com.server.pia.dto.LastFmUsernameRequest;
import com.server.pia.dto.UpdateProfileRequest;
import com.server.pia.entity.User;
import com.server.pia.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping("/me")
    public User getCurrentUser() {

        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return userRepository.findById(userId)
                .orElseThrow();
    }

    @PutMapping("/me/lastfm")
    public User updateCurrentUserLastFm(@RequestBody LastFmUsernameRequest request) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findById(userId).orElseThrow();
        String username = request.getLastfmUsername();
        user.setLastfmUsername(username == null ? null : username.trim());

        return userRepository.save(user);
    }

    @PutMapping("/me/profile")
    public User updateCurrentUserProfile(@RequestBody UpdateProfileRequest request) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findById(userId).orElseThrow();

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }

        return userRepository.save(user);
    }
}