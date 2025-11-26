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
    public Transaction processPayment(Long cardId, String toAccountNumber, BigDecimal amount, String remarks) {
        // 1. Fetch and Validate Card
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new RuntimeException("Card is not active");
        }

        if (!card.getCardType().contains("CREDIT")) {
            throw new RuntimeException("Card payments are only supported for Credit Cards");
        }

        // 2. Validate Limits
        // Per Transaction Limit
        if (amount.compareTo(card.getPerTransactionLimit()) > 0) {
            throw new RuntimeException("Amount exceeds per-transaction limit of " + card.getPerTransactionLimit());
        }

        // Daily Limit
        LocalDate today = LocalDate.now();
        if (!today.equals(card.getLastUsageDate())) {
            card.setDailyUsage(BigDecimal.ZERO);
            card.setLastUsageDate(today);
        }
        if (card.getDailyUsage().add(amount).compareTo(card.getDailyLimit()) > 0) {
            throw new RuntimeException("Daily limit exceeded. Remaining: " + card.getDailyLimit().subtract(card.getDailyUsage()));
        }

        // Credit Limit
        if (card.getUsedAmount().add(amount).compareTo(card.getCreditLimit()) > 0) {
            throw new RuntimeException("Insufficient credit limit");
        }

        // 3. Fetch Recipient Account
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Recipient account not found"));

        // 4. Perform Transfer
        // Update Card Usage
        card.setUsedAmount(card.getUsedAmount().add(amount));
        card.setDailyUsage(card.getDailyUsage().add(amount));
        cardRepository.save(card);

        // Credit Recipient
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(toAccount);

        // 5. Create Transaction Record
        Transaction transaction = Transaction.builder()
                .fromAccountNumber(card.getCardNumber()) // Use Card Number as source
                .toAccountNumber(toAccountNumber)
                .amount(amount)
                .remarks(remarks != null ? remarks : "Card Payment")
                .status("SUCCESS")
                .fromBalanceAfter(card.getCreditLimit().subtract(card.getUsedAmount())) // Available Limit
                .toBalanceAfter(toAccount.getBalance())
                .build();

        return transactionRepository.save(transaction);
    }
}
