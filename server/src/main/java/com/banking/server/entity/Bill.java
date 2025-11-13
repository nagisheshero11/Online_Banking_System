package com.banking.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username; // Linked to user

    @Column(nullable = false)
    private String billType; // Example: Electricity, Water, Internet

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Boolean paid = false; // Default unpaid
}