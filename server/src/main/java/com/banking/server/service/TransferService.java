package com.banking.server.service;

import com.banking.server.dto.TransferRequest;
import com.banking.server.dto.TransferResponse;
import com.banking.server.entity.Account;
import com.banking.server.entity.Transaction;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class TransferService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public TransferResponse transfer(String senderUsername, TransferRequest request) {
        String toAccountNumber = request.getToAccountNumber() == null ? null : request.getToAccountNumber().toUpperCase();

        if (toAccountNumber == null || toAccountNumber.isBlank())
            throw new IllegalArgumentException("Recipient account number is required.");
        if (!toAccountNumber.matches("^BK(SV|CR)\\d{7}$"))
            throw new IllegalArgumentException("Invalid recipient account number format.");

        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Transfer amount must be greater than zero.");

        Optional<Account> senderOpt = accountRepository.findByUsernameForUpdate(senderUsername);
        if (senderOpt.isEmpty())
            throw new RuntimeException("Sender account not found for user: " + senderUsername);
        Account sender = senderOpt.get();

        if (sender.getAccountNumber().equalsIgnoreCase(toAccountNumber))
            throw new IllegalArgumentException("Self-transfers are not allowed.");

        Optional<Account> recipientOpt = accountRepository.findByAccountNumberForUpdate(toAccountNumber);
        if (recipientOpt.isEmpty())
            throw new RuntimeException("Recipient account not found: " + toAccountNumber);
        Account recipient = recipientOpt.get();

        if (sender.getTransactionLimit() != null && amount.compareTo(sender.getTransactionLimit()) > 0)
            throw new IllegalArgumentException("Transfer amount exceeds your transaction limit.");
        if (sender.getBalance() == null || sender.getBalance().compareTo(amount) < 0)
            throw new IllegalArgumentException("Insufficient balance for transfer.");

        try {
            BigDecimal senderNewBalance = sender.getBalance().subtract(amount);
            BigDecimal recipientNewBalance = (recipient.getBalance() == null ? BigDecimal.ZERO : recipient.getBalance()).add(amount);

            sender.setBalance(senderNewBalance);
            recipient.setBalance(recipientNewBalance);

            accountRepository.save(sender);
            accountRepository.save(recipient);

            Transaction tx = Transaction.builder()
                    .fromAccountNumber(sender.getAccountNumber())
                    .toAccountNumber(recipient.getAccountNumber())
                    .amount(amount.setScale(2, BigDecimal.ROUND_HALF_UP))
                    .remarks(request.getRemarks() == null ? "" : request.getRemarks())
                    .status("COMPLETED")
                    .fromBalanceAfter(senderNewBalance)
                    .toBalanceAfter(recipientNewBalance)
                    .build();

            Transaction savedTx = transactionRepository.save(tx);

            return TransferResponse.builder()
                    .transactionId(savedTx.getTransactionId())
                    .fromAccountNumber(savedTx.getFromAccountNumber())
                    .toAccountNumber(savedTx.getToAccountNumber())
                    .amount(savedTx.getAmount())
                    .timestamp(savedTx.getCreatedAt())
                    .fromBalanceAfter(savedTx.getFromBalanceAfter())
                    .toBalanceAfter(savedTx.getToBalanceAfter())
                    .message("Transfer completed successfully.")
                    .build();

        } catch (Exception ex) {
            Transaction failedTx = Transaction.builder()
                    .fromAccountNumber(sender.getAccountNumber())
                    .toAccountNumber(toAccountNumber)
                    .amount(amount)
                    .remarks(request.getRemarks())
                    .status("FAILED")
                    .fromBalanceAfter(sender.getBalance())
                    .toBalanceAfter(recipientOpt.map(Account::getBalance).orElse(null))
                    .build();
            transactionRepository.save(failedTx);
            throw ex;
        }
    }
}
