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
     * ✅ Register new user and auto-create account
     */
    public void registerUser(SignupRequest request) {

        // Convert account number to uppercase before validation
        String upperAcc = request.getAccountNumber().toUpperCase();

        // ✅ Validate pattern
        if (!upperAcc.matches("^BK(SV|CR)\\d{7}$")) {
            throw new IllegalArgumentException(
                    "Invalid account number format! Must start with 'BK', followed by 'SV' or 'CR', and 7 digits (e.g., BKSV1234567)."
            );
        }

        // ✅ Check uniqueness
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

        // ✅ Create and save user
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

        // ✅ Determine account type and transaction limit
        String accountType = upperAcc.contains("SV") ? "SAVINGS" : "CURRENT";
        double transactionLimit = upperAcc.contains("SV") ? 10000.0 : 50000.0;

        // ✅ Create corresponding Account entity
        Account account = Account.builder()
                .username(user.getUsername())
                .accountNumber(user.getAccountNumber())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .balance(200000.0)
                .ifscCode("BKF14369")
                .accountType(accountType)
                .transactionLimit(transactionLimit)
                .build();

        accountRepository.save(account);
    }

    /**
     * ✅ Login user and generate JWT
     */
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmailOrUsername(), request.getPassword())
        );

        String token = jwtUtils.generateToken(request.getEmailOrUsername());

        User user = userRepository.findByEmail(request.getEmailOrUsername())
                .orElse(userRepository.findByUsername(request.getEmailOrUsername())
                        .orElseThrow(() -> new RuntimeException("User not found!")));

        return JwtResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}