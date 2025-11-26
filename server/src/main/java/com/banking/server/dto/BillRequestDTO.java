package com.banking.server.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillRequestDTO {
    private String username;
    private String accountNumber;
    private BigDecimal amount;
    private LocalDate dueDate;
    private String billType;
}
