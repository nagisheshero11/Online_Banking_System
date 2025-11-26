package com.banking.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Account account;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(nullable = false, unique = true, length = 10)
    private String panNumber;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    @Column(nullable = false, unique = true, length = 20)
    private String accountNumber;

    // Role must be stored in UPPERCASE (USER / ADMIN / SUPER_ADMIN)
    @Column(nullable = false, length = 20)
    private String role = "USER";

    // Ensure role is always uppercase
    public void setRole(String role) {
        this.role = (role != null) ? role.toUpperCase() : "USER";
    }

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}