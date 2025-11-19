package com.banking.server.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    private String loanType;
    private BigDecimal loanAmount;
    private Integer tenureMonths;
}