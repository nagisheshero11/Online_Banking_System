package com.banking.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which user this bill belongs to
    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String accountNumber;

    // linked loan id (nullable if generic bill)
    private Long loanId;

    // amount to pay (interest for the period)
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false, length = 20)
    private String status = "UNPAID"; // UNPAID, PAID, OVERDUE

    @CreationTimestamp
    private LocalDateTime createdAt;
}