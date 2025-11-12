package com.banking.server.dto;

import lombok.Data;

@Data
public class UpdateTransactionLimitRequest {
    private double newLimit;
}