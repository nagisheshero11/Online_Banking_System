package com.banking.server.controller;

import com.banking.server.dto.TransferRequest;
import com.banking.server.dto.TransferResponse;
import com.banking.server.entity.Account;
import com.banking.server.entity.Transaction;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.TransactionRepository;
import com.banking.server.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/account")
public class TransferController {

    @Autowired
    private TransferService transferService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private com.banking.server.repository.CardRepository cardRepository;

    @Autowired
    private com.banking.server.repository.UserRepository userRepository;

    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(Authentication authentication,
                                           @RequestBody TransferRequest request) {
        String username = authentication.getName();
        try {
            TransferResponse response = transferService.transfer(username, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            String msg = e.getMessage() == null ? "Transfer failed." : e.getMessage();
            if (msg.toLowerCase().contains("not found"))
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Transfer failed: " + e.getMessage());
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getUserTransactions(Authentication authentication) {
        try {
            String username = authentication.getName();
            System.out.println("DEBUG: Fetching transactions for user: " + username);

            // Get sender’s account
            Optional<Account> accountOpt = accountRepository.findByUsername(username);
            if (accountOpt.isEmpty()) {
                System.out.println("DEBUG: Account not found for user: " + username);
                return ResponseEntity.status(404).body("Account not found for user: " + username);
            }

            String accountNumber = accountOpt.get().getAccountNumber();
            System.out.println("DEBUG: Account Number: " + accountNumber);
            
            // Safe User ID Fetch
            Long userId;
            if (accountOpt.get().getUser() != null) {
                userId = accountOpt.get().getUser().getId();
            } else {
                System.out.println("DEBUG: account.getUser() is null. Fetching from UserRepository.");
                com.banking.server.entity.User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found: " + username));
                userId = user.getId();
            }
            System.out.println("DEBUG: User ID: " + userId);

            if (cardRepository == null) {
                System.out.println("DEBUG: cardRepository is NULL!");
                return ResponseEntity.status(500).body("Internal Error: CardRepository not initialized");
            }
            
            if (transactionRepository == null) {
                System.out.println("DEBUG: transactionRepository is NULL!");
                return ResponseEntity.status(500).body("Internal Error: TransactionRepository not initialized");
            }

            // Fetch user's cards
            List<String> cardNumbers = cardRepository.findByUserId(userId)
                    .stream()
                    .map(com.banking.server.entity.Card::getCardNumber)
                    .collect(java.util.stream.Collectors.toList());
            
            System.out.println("DEBUG: Card Numbers: " + cardNumbers);

            // Combine account number and card numbers
            List<String> allSources = new java.util.ArrayList<>();
            allSources.add(accountNumber);
            if (cardNumbers != null) {
                allSources.addAll(cardNumbers);
            }
            
            System.out.println("DEBUG: All Sources: " + allSources);

            // Fetch all transactions (sent + received) for ALL sources
            List<Transaction> transactions = transactionRepository.findAllByAccountNumbers(allSources);
            System.out.println("DEBUG: Transactions found: " + transactions.size());

            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching transactions: " + e.getMessage());
        }
    }

}
