package com.banking.server.controller;

import com.banking.server.dto.UserResponseDTO;
import com.banking.server.entity.User;
import com.banking.server.entity.Account;
import com.banking.server.service.UserService;
import com.banking.server.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AccountRepository accountRepository;

    /**
     * GET /api/admin/users/all?search=...
     * Fetch all users or search by keyword
     */
    @GetMapping("/all")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers(@RequestParam(required = false) String search) {
        List<User> users = userService.searchUsers(search);

        List<UserResponseDTO> response = users.stream()
                .filter(user -> "USER".equals(user.getRole())) // Filter only USER role
                .map(user -> {
                    Account account = user.getAccount();
                    // Fallback: if relationship is null, fetch by username
                    if (account == null) {
                        account = accountRepository.findByUsername(user.getUsername()).orElse(null);
                    }

                    return UserResponseDTO.builder()
                            .id(user.getId())
                            .fullName(user.getFirstName() + " " + user.getLastName())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .phoneNumber(user.getPhoneNumber())
                            .panNumber(user.getPanNumber())
                            .accountNumber(user.getAccountNumber())
                            .balance(account != null ? account.getBalance() : null)
                            .accountType(account != null ? account.getAccountType() : "N/A")
                            .role(user.getRole())
                            .createdAt(user.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
