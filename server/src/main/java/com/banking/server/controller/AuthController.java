package com.banking.server.controller;

import com.banking.server.dto.*;
import com.banking.server.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * USER Signup (role always = USER)
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok("User registered successfully");
    }

    /**
     * Login (USER / ADMIN / SUPER_ADMIN)
     * Returns JWT + role info
     */
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * ⚠ NOTE:
     * Admin and Super Admin creation endpoints will be placed in a separate
     * AdminAuthController or AdminController to avoid exposing them here.
     *
     * Example we will add later:
     * POST /api/admin/create-user-with-role
     * POST /api/setup/superadmin  (one-time setup)
     */
}