package com.banking.server.controller;

import com.banking.server.dto.AccountResponse;
import com.banking.server.dto.UpdateTransactionLimitRequest;
import com.banking.server.entity.Account;
import com.banking.server.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    // ✅ Get account info
    @GetMapping("/me")
    public ResponseEntity<?> getAccountByUsername(Authentication authentication) {
        String username = authentication.getName();
        Optional<Account> accountOpt = accountRepository.findByUsername(username);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Account not found for user: " + username);
        }

        Account account = accountOpt.get();

        AccountResponse response = AccountResponse.builder()
                .username(account.getUsername())
                .accountNumber(account.getAccountNumber())
                .firstName(account.getFirstName())
                .lastName(account.getLastName())
                .balance(account.getBalance())
                .ifscCode(account.getIfscCode())
                .accountType(account.getAccountType())
                .transactionLimit(account.getTransactionLimit())
                .createdAt(account.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }

    // ✅ Update transaction limit
    @PutMapping("/limit")
    public ResponseEntity<?> updateTransactionLimit(Authentication authentication,
                                                    @RequestBody UpdateTransactionLimitRequest request) {
        String username = authentication.getName();
        Optional<Account> accountOpt = accountRepository.findByUsername(username);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Account not found for user: " + username);
        }

        Account account = accountOpt.get();
        double newLimit = request.getNewLimit();

        // ✅ Enforce limit rules
        if ("Savings".equalsIgnoreCase(account.getAccountType()) && newLimit > 50000) {
            return ResponseEntity.badRequest().body("Savings account limit cannot exceed ₹50,000.");
        }
        if ("Current".equalsIgnoreCase(account.getAccountType()) && newLimit > 200000) {
            return ResponseEntity.badRequest().body("Current account limit cannot exceed ₹2,00,000.");
        }

        account.setTransactionLimit(newLimit);
        accountRepository.save(account);

        return ResponseEntity.ok("Transaction limit updated successfully to ₹" + newLimit);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }
}