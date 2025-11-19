package com.banking.server.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferResponse {

    private String transactionId;
    private String fromAccountNumber;
    private String toAccountNumber;

    private BigDecimal amount;
    private LocalDateTime timestamp;

    private BigDecimal fromBalanceAfter;
    private BigDecimal toBalanceAfter;

    private String message;
}