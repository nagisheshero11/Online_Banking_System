package com.banking.server.controller;

import com.banking.server.dto.LoanApplicationResponse;
import com.banking.server.entity.LoanApplication;
import com.banking.server.repository.LoanApplicationRepository;
import com.banking.server.repository.AccountRepository;
import com.banking.server.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/loans")
public class AdminLoanController {

    @Autowired
    private LoanApplicationRepository loanRepository;

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
        return loanRepository.findAll().stream()
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
}