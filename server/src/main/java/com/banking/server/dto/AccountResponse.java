package com.banking.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private String username;
    private String accountNumber;

    private String firstName;
    private String lastName;

    private double balance;
    private String ifscCode;
    private String accountType;
    private double transactionLimit;

    private LocalDateTime createdAt;
}