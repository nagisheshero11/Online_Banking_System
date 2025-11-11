package com.banking.server.controller;

import com.banking.server.dto.JwtResponse;
import com.banking.server.entity.User;
import com.banking.server.security.JwtUtils;
import com.banking.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * ✅ Get currently logged-in user's profile using JWT token
     * Token must be sent in Authorization header as:
     * Authorization: Bearer <token>
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        // Authentication object comes from JWT filter
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    /**
     * ✅ Get all users (Admin-only feature in future)
     * For now, accessible by any logged-in user.
     */
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * ✅ Update logged-in user's details
     */
    @PutMapping("/update")
    public ResponseEntity<User> updateUserProfile(
            @RequestBody User updatedUser,
            Authentication authentication) {

        String username = authentication.getName();
        User user = userService.updateUser(username, updatedUser);
        return ResponseEntity.ok(user);
    }
}