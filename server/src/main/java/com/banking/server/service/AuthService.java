package com.banking.server.service;

import com.banking.server.dto.*;
import com.banking.server.entity.Account;
import com.banking.server.entity.User;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.UserRepository;
import com.banking.server.security.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Register new user
     */
    public void registerUser(SignupRequest request) {

        String upperAcc = request.getAccountNumber().toUpperCase();

        if (!upperAcc.matches("^BK(SV|CR)\\d{7}$")) {
            throw new IllegalArgumentException("Invalid account number format!");
        }

        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists!");

        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already exists!");

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new RuntimeException("Phone number already registered!");

        if (userRepository.existsByPanNumber(request.getPanNumber()))
            throw new RuntimeException("PAN number already registered!");

        if (userRepository.existsByAccountNumber(upperAcc))
            throw new RuntimeException("Account number already exists!");

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .panNumber(request.getPanNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountNumber(upperAcc)
                .role("USER")
                .build();

        userRepository.save(user);

        String accountType = upperAcc.contains("SV") ? "SAVINGS" : "CURRENT";
        BigDecimal transactionLimit = upperAcc.contains("SV")
                ? BigDecimal.valueOf(10000)
                : BigDecimal.valueOf(50000);

        Account account = Account.builder()
                .username(user.getUsername())
                .accountNumber(user.getAccountNumber())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .balance(BigDecimal.valueOf(200000))
                .ifscCode("BKF14369")
                .accountType(accountType)
                .transactionLimit(transactionLimit)
                .build();

        accountRepository.save(account);
    }

    /**
     * Login + Generate JWT
     */
    public JwtResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmailOrUsername())
                .orElse(userRepository.findByUsername(request.getEmailOrUsername())
                        .orElseThrow(() -> new RuntimeException("User not found!")));

        // 🔥 FIX: Add ROLE_ prefix for Spring Security compatibility
        String roleWithPrefix = "ROLE_" + user.getRole();

        // Generate JWT
        String token = jwtUtils.generateToken(user.getUsername(), roleWithPrefix);

        return JwtResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(roleWithPrefix)   // send ROLE_USER or ROLE_ADMIN
                .build();
    }
}