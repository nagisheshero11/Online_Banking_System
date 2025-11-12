package com.banking.server.controller;

import com.banking.server.dto.UserUpdateRequest;
import com.banking.server.entity.User;
import com.banking.server.security.JwtUtils;
import com.banking.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    /**
     * Update profile endpoint
     * PUT /api/user/profile/update
     */
    @PutMapping("/profile/update")
    public ResponseEntity<User> updateUserProfile(@RequestBody UserUpdateRequest request, Authentication authentication) {
        String username = authentication.getName();
        User updatedUser = userService.updateUserProfile(username, request);
        return ResponseEntity.ok(updatedUser);
    }
}