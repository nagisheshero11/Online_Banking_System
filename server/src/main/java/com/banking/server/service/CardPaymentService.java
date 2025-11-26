package com.banking.server.service;

import com.banking.server.entity.Account;
import com.banking.server.entity.Card;
import com.banking.server.entity.Transaction;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.CardRepository;
import com.banking.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class CardPaymentService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Transaction processPayment(Long cardId, String toAccountNumber, BigDecimal amount, String remarks,
            String pin) {
        // 1. Fetch and Validate Card
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new RuntimeException("Card is not active");
        }

        // Validate PIN
        if (card.getPin() == null || !card.getPin().equals(pin)) {
            throw new RuntimeException("Invalid PIN");
        }

        // Initialize Usage if null
        if (card.getDailyUsage() == null) {
            card.setDailyUsage(BigDecimal.ZERO);
        }
        if (card.getUsedAmount() == null) {
            card.setUsedAmount(BigDecimal.ZERO);
        }

        // 2. Validate Limits
        // Per Transaction Limit
        if (card.getPerTransactionLimit() != null && amount.compareTo(card.getPerTransactionLimit()) > 0) {
            throw new RuntimeException("Amount exceeds per-transaction limit of " + card.getPerTransactionLimit());
        }

        // Daily Limit
        LocalDate today = LocalDate.now();
        if (!today.equals(card.getLastUsageDate())) {
            card.setDailyUsage(BigDecimal.ZERO);
            card.setLastUsageDate(today);
        }
        if (card.getDailyLimit() != null && card.getDailyUsage().add(amount).compareTo(card.getDailyLimit()) > 0) {
            throw new RuntimeException(
                    "Daily limit exceeded. Remaining: " + card.getDailyLimit().subtract(card.getDailyUsage()));
        }

        // 3. Handle Payment Source (Credit vs Debit)
        if (card.getCardType().contains("CREDIT")) {
            // Credit Card Logic
            if (card.getCreditLimit() != null
                    && card.getUsedAmount().add(amount).compareTo(card.getCreditLimit()) > 0) {
                throw new RuntimeException("Insufficient credit limit");
            }
            card.setUsedAmount(card.getUsedAmount().add(amount));
        } else {
            // Debit Card Logic
            Account userAccount = card.getUser().getAccount();
            if (userAccount == null) {
                throw new RuntimeException("No linked account found for this debit card");
            }
            if (userAccount.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient funds in linked account");
            }
            userAccount.setBalance(userAccount.getBalance().subtract(amount));
            accountRepository.save(userAccount);
        }

        // 4. Fetch Recipient Account
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Recipient account not found"));

        // 5. Perform Transfer
        // Update Card Usage (Common for both)
        card.setDailyUsage(card.getDailyUsage().add(amount));
        cardRepository.save(card);

        // Credit Recipient
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(toAccount);

        // 6. Create Transaction Record
        BigDecimal sourceBalanceAfter;
        if (card.getCardType().contains("CREDIT")) {
            sourceBalanceAfter = (card.getCreditLimit() != null)
                    ? card.getCreditLimit().subtract(card.getUsedAmount())
                    : BigDecimal.ZERO;
        } else {
            sourceBalanceAfter = card.getUser().getAccount().getBalance();
        }

        Transaction transaction = Transaction.builder()
                .fromAccountNumber(card.getCardNumber()) // Use Card Number as source
                .toAccountNumber(toAccountNumber)
                .amount(amount)
                .remarks(remarks != null ? remarks : "Card Payment")
                .status("SUCCESS")
                .fromBalanceAfter(sourceBalanceAfter)
                .toBalanceAfter(toAccount.getBalance())
                .build();

        return transactionRepository.save(transaction);
    }
}
