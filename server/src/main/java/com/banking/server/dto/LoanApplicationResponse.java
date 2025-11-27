package com.banking.server.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class LoanApplicationResponse {

    private Long id;
    private String loanType;
    private BigDecimal loanAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String status;
    private LocalDateTime createdAt;

    // Enhanced Details
    private String username;
    private String fullName;
    private String accountNumber;
    private BigDecimal currentBalance;

    // User Loan History
    private Long totalLoansApplied;
    private Long loansApproved;
    private Long loansRejected;
}