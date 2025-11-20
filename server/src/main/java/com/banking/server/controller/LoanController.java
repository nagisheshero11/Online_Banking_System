package com.banking.server.controller;

import com.banking.server.dto.LoanApplicationRequest;
import com.banking.server.dto.LoanApplicationResponse;
import com.banking.server.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    /**
     * USER → Apply for a Loan
     */
    @PostMapping("/apply")
    public LoanApplicationResponse applyLoan(
            @RequestBody LoanApplicationRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return loanService.applyLoan(username, request);
    }

    /**
     * USER → Fetch My Loans
     */
    @GetMapping("/my")
    public List<LoanApplicationResponse> getMyLoans(Authentication authentication) {
        String username = authentication.getName();
        return loanService.getMyLoans(username);
    }
}