package com.banking.server.controller;

import com.banking.server.dto.AccountResponse;
import com.banking.server.dto.UpdateTransactionLimitRequest;
import com.banking.server.entity.Account;
import com.banking.server.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    /**
     * ✅ Get account info of logged-in user
     */
    @GetMapping("/me")
    public ResponseEntity<?> getAccountByUsername(Authentication authentication) {
        String username = authentication.getName();
        System.out.println("DEBUG: Fetching account details for: " + username);
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
                .balance(account.getBalance().setScale(2, BigDecimal.ROUND_HALF_UP))
                .ifscCode(account.getIfscCode())
                .accountType(account.getAccountType())
                .transactionLimit(account.getTransactionLimit().setScale(2, BigDecimal.ROUND_HALF_UP))
                .createdAt(account.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * ✅ Update transaction limit (with BigDecimal & business validation)
     */
    @PutMapping("/limit")
    public ResponseEntity<?> updateTransactionLimit(
            Authentication authentication,
            @RequestBody UpdateTransactionLimitRequest request) {

        String username = authentication.getName();
        Optional<Account> accountOpt = accountRepository.findByUsername(username);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Account not found for user: " + username);
        }

        Account account = accountOpt.get();

        BigDecimal newLimit = BigDecimal.valueOf(request.getNewLimit());
        String accountType = account.getAccountType().toUpperCase();

        // ✅ Enforce limit rules
        if (accountType.equals("SAVINGS") && newLimit.compareTo(BigDecimal.valueOf(50000)) > 0) {
            return ResponseEntity.badRequest().body("Savings account limit cannot exceed ₹50,000.");
        }
        if (accountType.equals("CURRENT") && newLimit.compareTo(BigDecimal.valueOf(200000)) > 0) {
            return ResponseEntity.badRequest().body("Current account limit cannot exceed ₹2,00,000.");
        }

        // ✅ Update limit
        account.setTransactionLimit(newLimit);
        accountRepository.save(account);

        return ResponseEntity.ok("Transaction limit updated successfully to ₹" + newLimit.setScale(2));
    }

    /**
     * ✅ Get all accounts (for admin/testing)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    /**
     * ✅ Verify Account Number OR Username (for transfer)
     */
    @GetMapping("/verify/{identifier}")
    public ResponseEntity<?> verifyAccount(@PathVariable String identifier) {
        // Try finding by Account Number
        Optional<Account> accountOpt = accountRepository.findByAccountNumber(identifier);

        // If not found, try finding by Username
        if (accountOpt.isEmpty()) {
            accountOpt = accountRepository.findByUsername(identifier);
        }

        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            return ResponseEntity.ok(java.util.Map.of(
                    "valid", true,
                    "fullName", account.getFirstName() + " " + account.getLastName(),
                    "username", account.getUsername()));
        } else {
            return ResponseEntity.ok(java.util.Map.of("valid", false));
        }
    }
}
