package com.banking.server.repository;

import com.banking.server.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUsername(String username);

    List<Bill> findByLoanId(Long loanId);

    List<Bill> findByDueDateBeforeAndStatus(LocalDate date, String status);

    List<Bill> findByLoanIdAndUsername(Long loanId, String username);

    List<Bill> findByCardIdAndUsername(Long cardId, String username);

    @Query("SELECT b FROM Bill b WHERE b.username = :username AND b.dueDate <= :cutoffDate AND b.status = 'UNPAID'")
    List<Bill> findUpcomingBills(@Param("username") String username, @Param("cutoffDate") LocalDate cutoffDate);

    // Find the latest bill generated for a card
    java.util.Optional<Bill> findTopByCardIdOrderByCreatedAtDesc(Long cardId);

    // Find unpaid bills for a specific card
    List<Bill> findByCardIdAndStatus(Long cardId, String status);
}