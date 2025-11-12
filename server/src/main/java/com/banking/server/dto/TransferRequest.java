package com.banking.server.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferRequest {
    private String toAccountNumber;
    private BigDecimal amount;
    private String remarks;
}
