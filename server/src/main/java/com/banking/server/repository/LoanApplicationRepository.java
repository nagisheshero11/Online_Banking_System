package com.banking.server.repository;

import com.banking.server.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByUsername(String username);

    long countByStatus(String status);
}