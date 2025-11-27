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

    /**
     * Get logged-in user's profile
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    /**
     * Update limited profile fields (firstName, lastName, phoneNumber)
     * PUT /api/user/profile/update
     * This endpoint does NOT allow:
     * - changing email
     * - changing PAN
     * - changing role
     * - changing password (separate endpoint)
     */
    @PutMapping("/profile/update")
    public ResponseEntity<User> updateUserProfile(
            @RequestBody UserUpdateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User updatedUser = userService.updateUserProfile(username, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Change Password
     * POST /api/user/profile/change-password
     */
    @PostMapping("/profile/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody java.util.Map<String, String> payload,
            Authentication authentication) {
        String username = authentication.getName();
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        userService.changePassword(username, oldPassword, newPassword);
        return ResponseEntity.ok("Password changed successfully");
    }

    /**
     * ⚠ NOTE:
     * Admin-only functions like updating role, disabling user, etc.
     * will be added in a separate AdminController.
     */
}