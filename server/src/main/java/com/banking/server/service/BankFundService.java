package com.banking.server.service;

import com.banking.server.entity.BankFund;
import com.banking.server.entity.BankTransaction;
import com.banking.server.repository.BankFundRepository;
import com.banking.server.repository.BankTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BankFundService {

    @Autowired
    private BankFundRepository bankFundRepository;

    @Autowired
    private BankTransactionRepository bankTransactionRepository;

    private static final BigDecimal INITIAL_RESERVE = new BigDecimal("100000000.00"); // 10 Crore

    /**
     * Get current bank funds. Initialize if not present.
     */
    public BankFund getBankFunds() {
        List<BankFund> funds = bankFundRepository.findAll();
        if (funds.isEmpty()) {
            BankFund newFund = BankFund.builder()
                    .totalBalance(INITIAL_RESERVE)
                    .build();
            return bankFundRepository.save(newFund);
        }
        return funds.get(0);
    }

    /**
     * Debit funds (e.g., Loan Approved)
     */
    @Transactional
    public void debitFunds(BigDecimal amount, String description) {
        BankFund fund = getBankFunds();
        fund.setTotalBalance(fund.getTotalBalance().subtract(amount));
        bankFundRepository.save(fund);

        // Log Transaction
        BankTransaction tx = BankTransaction.builder()
                .transactionType("DEBIT")
                .amount(amount)
                .description(description)
                .balanceAfter(fund.getTotalBalance())
                .build();
        bankTransactionRepository.save(tx);
    }

    /**
     * Credit funds (e.g., EMI Paid)
     */
    @Transactional
    public void creditFunds(BigDecimal amount, String description) {
        BankFund fund = getBankFunds();
        fund.setTotalBalance(fund.getTotalBalance().add(amount));
        bankFundRepository.save(fund);

        // Log Transaction
        BankTransaction tx = BankTransaction.builder()
                .transactionType("CREDIT")
                .amount(amount)
                .description(description)
                .balanceAfter(fund.getTotalBalance())
                .build();
        bankTransactionRepository.save(tx);
    }

    public List<BankTransaction> getHistory() {
        return bankTransactionRepository.findAllByOrderByTimestampDesc();
    }
}
