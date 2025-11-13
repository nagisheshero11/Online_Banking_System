package com.banking.server.service;

import com.banking.server.entity.Account;
import com.banking.server.entity.Bill;
import com.banking.server.entity.Transaction;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.BillRepository;
import com.banking.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    /**
     * ADMIN — Create bill
     */
    public Bill createBill(Bill bill) {
        bill.setPaid(false);
        return billRepository.save(bill);
    }

    /**
     * USER — Fetch user's bills
     */
    public List<Bill> getBillsForUser(String username) {
        return billRepository.findByUsername(username);
    }

    /**
     * USER — Pay bill: deduct balance + create transaction + delete bill
     */
    public void payBill(Long billId, String username) {

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (!bill.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized bill access");
        }

        // Fetch user account
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        BigDecimal balance = account.getBalance();

        if (balance.compareTo(BigDecimal.valueOf(bill.getAmount())) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct balance
        BigDecimal updatedBalance =
                balance.subtract(BigDecimal.valueOf(bill.getAmount()));

        account.setBalance(updatedBalance);
        accountRepository.save(account);

        // Create transaction using new Transaction entity
        Transaction tx = Transaction.builder()
                .fromAccountNumber(account.getAccountNumber())
                .toAccountNumber("BILL_PAYMENT")
                .amount(BigDecimal.valueOf(bill.getAmount()))
                .status("SUCCESS")
                .remarks("Bill Payment: " + bill.getBillType())
                .fromBalanceAfter(updatedBalance)
                .toBalanceAfter(null)
                .build();

        transactionRepository.save(tx);

        // Remove bill
        billRepository.delete(bill);
    }
}