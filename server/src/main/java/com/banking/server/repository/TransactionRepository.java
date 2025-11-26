package com.banking.server.repository;

import com.banking.server.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ Transactions sent by this account
    @Query("SELECT t FROM Transaction t WHERE t.fromAccountNumber = :accountNumber ORDER BY t.createdAt DESC")
    List<Transaction> findSentTransactions(@Param("accountNumber") String accountNumber);

    // ✅ Transactions received by this account
    @Query("SELECT t FROM Transaction t WHERE t.toAccountNumber = :accountNumber ORDER BY t.createdAt DESC")
    List<Transaction> findReceivedTransactions(@Param("accountNumber") String accountNumber);

    // ✅ All transactions involving this account (sent OR received)
    @Query("SELECT t FROM Transaction t WHERE t.fromAccountNumber = :accountNumber OR t.toAccountNumber = :accountNumber ORDER BY t.createdAt DESC")
    List<Transaction> findAllByAccountNumber(@Param("accountNumber") String accountNumber);

    // ✅ All transactions involving any of the provided account numbers (sent OR received)
    @Query("SELECT t FROM Transaction t WHERE t.fromAccountNumber IN :accountNumbers OR t.toAccountNumber IN :accountNumbers ORDER BY t.createdAt DESC")
    List<Transaction> findAllByAccountNumbers(@Param("accountNumbers") List<String> accountNumbers);

    // ✅ All transactions (Admin only)
    List<Transaction> findAllByOrderByCreatedAtDesc();
}
