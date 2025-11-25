package com.banking.server.repository;

import com.banking.server.entity.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {
    // Fetch all sorted by timestamp descending
    List<BankTransaction> findAllByOrderByTimestampDesc();
}
