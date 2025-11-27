
package com.banking.server.controller;

import com.banking.server.dto.LoanApplicationResponse;
import com.banking.server.entity.Account;
import com.banking.server.entity.LoanApplication;
import com.banking.server.entity.User;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.LoanApplicationRepository;
import com.banking.server.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/loans")
public class AdminLoanController {

    @Autowired
    private LoanApplicationRepository loanRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LoanService loanService;

    /**
     * Approve loan -> credits account and marks loan APPROVED
     */
    @PostMapping("/approve/{loanId}")
    public ResponseEntity<?> approveLoan(@PathVariable Long loanId) {
        LoanApplicationResponse res = loanService.approveLoan(loanId);
        return ResponseEntity.ok(res);
    }

    /**
     * Reject loan
     */
    @PostMapping("/reject/{loanId}")
    public ResponseEntity<?> rejectLoan(@PathVariable Long loanId) {
        loanService.rejectLoan(loanId);
        return ResponseEntity.ok("Loan rejected");
    }

    @GetMapping("/all")
    public List<LoanApplicationResponse> getAllLoans() {
        return loanRepository.findAll().stream().map(loan -> {
            // Fetch Account and User details
            Account account = accountRepository.findByAccountNumber(loan.getAccountNumber()).orElse(null);
            User user = (account != null) ? account.getUser() : null;

            // Calculate User Loan Stats
            List<LoanApplication> userLoans = loanRepository.findByUsername(loan.getUsername());
            long totalApplied = userLoans.size();
            long approved = userLoans.stream()
                    .filter(l -> "APPROVED".equals(l.getStatus()) || "COMPLETED".equals(l.getStatus())).count();
            long rejected = userLoans.stream().filter(l -> "REJECTED".equals(l.getStatus())).count();

            return LoanApplicationResponse.builder().id(loan.getId()).loanType(loan.getLoanType())
                    .loanAmount(loan.getLoanAmount()).tenureMonths(loan.getTenureMonths())
                    .interestRate(loan.getInterestRate()).status(loan.getStatus()).createdAt(loan.getCreatedAt())
                    // Enhanced Details
                    .username(loan.getUsername()).accountNumber(loan.getAccountNumber())
                    .fullName(user != null ? user.getFirstName() + " " + user.getLastName() : "Unknown")
                    .currentBalance(account != null ? account.getBalance() : java.math.BigDecimal.ZERO)
                    .totalLoansApplied(totalApplied).loansApproved(approved).loansRejected(rejected).build();
        }).collect(Collectors.toList());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getLoanStats() {
        return ResponseEntity.ok(loanService.getLoanStatistics());
    }

    @GetMapping("/history")
    public ResponseEntity<?> getLoanHistory() {
        return ResponseEntity.ok(loanService.getLoanHistory());
    }
}