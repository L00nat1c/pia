package com.server.pia.controller;

import com.server.pia.dto.LoginRequest;
import com.server.pia.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.server.pia.dto.RegisterRequest;
import com.server.pia.entity.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return authService.login(
                request.getEmail(),
                request.getPassword()
        );
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}