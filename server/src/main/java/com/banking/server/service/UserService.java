package com.banking.server.service;

import com.banking.server.dto.UserUpdateRequest;
import com.banking.server.entity.User;
import com.banking.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get all users (Admin only)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Find user by username
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    /**
     * Update full user object (Admin-use ONLY)
     */
    public User updateUser(String username, User updatedUser) {
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setPanNumber(updatedUser.getPanNumber());
        existingUser.setEmail(updatedUser.getEmail());

        // ❗ Do NOT update password here
        // ❗ Do NOT allow role update here

        return userRepository.save(existingUser);
    }

    /**
     * Change user password
     */
    public User changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    /**
     * Update limited profile fields (User-safe)
     */
    public User updateUserProfile(String username, UserUpdateRequest updateRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (updateRequest.getFirstName() != null)
            user.setFirstName(updateRequest.getFirstName());

        if (updateRequest.getLastName() != null)
            user.setLastName(updateRequest.getLastName());

        if (updateRequest.getPhoneNumber() != null)
            user.setPhoneNumber(updateRequest.getPhoneNumber());

        // ❗ Do NOT allow email, panNumber, or role update from profile page

        return userRepository.save(user);
    }

    /**
     * ✅ ADMIN FEATURE: Update user role (ADMIN, USER, SUPER_ADMIN)
     * Role is always saved in UPPERCASE (handled by User::setRole)
     */
    public User updateUserRole(String username, String newRole) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        user.setRole(newRole.toUpperCase());
        return userRepository.save(user);
    }
}