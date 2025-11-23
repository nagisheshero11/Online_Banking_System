package com.banking.server.service;

import com.banking.server.dto.LoanApplicationRequest;
import com.banking.server.dto.LoanApplicationResponse;
import com.banking.server.entity.Account;
import com.banking.server.entity.LoanApplication;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.LoanApplicationRepository;
import com.banking.server.repository.BillRepository;
import com.banking.server.entity.Bill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanService {

    @Autowired
    private LoanApplicationRepository loanRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillService billService;

    // interest rate map (string based)
    private BigDecimal getInterestRate(String loanType) {

        loanType = loanType.toUpperCase();

        return switch (loanType) {
            case "PERSONAL" -> new BigDecimal("8.5");
            case "HOME" -> new BigDecimal("7.2");
            case "CAR", "VEHICLE" -> new BigDecimal("8.0");
            case "EDUCATION" -> new BigDecimal("6.9");
            case "BUSINESS" -> new BigDecimal("9.5");
            default -> throw new RuntimeException("Invalid loan type");
        };
    }

    public LoanApplicationResponse applyLoan(String username, LoanApplicationRequest request) {

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        BigDecimal interestRate = getInterestRate(request.getLoanType());

        LoanApplication loan = LoanApplication.builder()
                .username(username)
                .accountNumber(account.getAccountNumber())
                .loanType(request.getLoanType().toUpperCase())
                .loanAmount(request.getLoanAmount())
                .tenureMonths(request.getTenureMonths())
                .interestRate(interestRate)
                .status("PENDING")
                .build();

        loanRepository.save(loan);

        return LoanApplicationResponse.builder()
                .id(loan.getId())
                .loanType(loan.getLoanType())
                .loanAmount(loan.getLoanAmount())
                .tenureMonths(loan.getTenureMonths())
                .interestRate(loan.getInterestRate())
                .status(loan.getStatus())
                .createdAt(loan.getCreatedAt())
                .build();
    }

    public List<LoanApplicationResponse> getMyLoans(String username) {

        return loanRepository.findByUsername(username)
                .stream()
                .map(loan -> LoanApplicationResponse.builder()
                        .id(loan.getId())
                        .loanType(loan.getLoanType())
                        .loanAmount(loan.getLoanAmount())
                        .tenureMonths(loan.getTenureMonths())
                        .interestRate(loan.getInterestRate())
                        .status(loan.getStatus())
                        .createdAt(loan.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Approve loan:
     *  - mark loan APPROVED
     *  - credit loan principal into user's account (use pessimistic lock)
     *  - generate monthly EMI bills for tenure months
     */
    @Transactional
    public LoanApplicationResponse approveLoan(Long loanId) {
        LoanApplication loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if ("APPROVED".equalsIgnoreCase(loan.getStatus())) {
            throw new RuntimeException("Loan already approved");
        }

        // Lock account and credit amount
        Account account = accountRepository.findByAccountNumberForUpdate(loan.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Defensive: ensure balance is not null
        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }

        // credit amount
        BigDecimal newBalance = account.getBalance().add(loan.getLoanAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        // mark balance_credited if field present on loan
        try {
            // If loan entity has balanceCredited field, set true
            // (uses reflection so file compiles whether or not field present)
            var f = LoanApplication.class.getDeclaredField("balanceCredited");
            f.setAccessible(true);
            f.set(loan, true);
        } catch (NoSuchFieldException ignored) {
            // field not present - ignore
        } catch (Exception e) {
            // non-fatal — just log (do not abort)
            System.err.println("Warning: could not set balanceCredited flag on loan: " + e.getMessage());
        }

        // Update loan status
        loan.setStatus("APPROVED");
        loanRepository.save(loan);

        // Generate EMI bills
        billService.generateMonthlyEmiBills(loan, loan.getUsername(), loan.getAccountNumber());

        return LoanApplicationResponse.builder()
                .id(loan.getId())
                .loanType(loan.getLoanType())
                .loanAmount(loan.getLoanAmount())
                .tenureMonths(loan.getTenureMonths())
                .interestRate(loan.getInterestRate())
                .status(loan.getStatus())
                .createdAt(loan.getCreatedAt())
                .build();
    }

    /**
     * Reject loan: mark as REJECTED (no credit, no bills)
     */
    @Transactional
    public void rejectLoan(Long loanId) {
        LoanApplication loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus("REJECTED");
        loanRepository.save(loan);
    }
}