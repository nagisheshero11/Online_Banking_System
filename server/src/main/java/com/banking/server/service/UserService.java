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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public User updateUser(String username, User updatedUser) {
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setPanNumber(updatedUser.getPanNumber());
        existingUser.setEmail(updatedUser.getEmail());

        return userRepository.save(existingUser);
    }

    public User changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    /**
     * ✅ Update limited user fields (used in profile page)
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

        return userRepository.save(user);
    }
}