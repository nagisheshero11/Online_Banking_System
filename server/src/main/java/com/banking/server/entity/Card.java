package com.banking.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String cardType; // PLATINUM_DEBIT, SIGNATURE_CREDIT, NORMAL_CREDIT

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private String cardHolder;

    @Column(nullable = false)
    private String expiryDate; // MM/YY

    @Column(nullable = false)
    private String cvv;

    private String pin;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACTIVE, BLOCKED, REJECTED

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
