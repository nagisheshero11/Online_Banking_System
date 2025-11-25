package com.banking.server.repository;

import com.banking.server.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUsername(String username);
    List<Bill> findByLoanId(Long loanId);
    List<Bill> findByDueDateBeforeAndStatus(LocalDate date, String status);
    List<Bill> findByLoanIdAndUsername(Long loanId, String username);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Bill b WHERE b.username = :username AND (b.billType != 'EMI' OR b.dueDate <= :cutoffDate) ORDER BY b.dueDate ASC")
    List<Bill> findUpcomingBills(@org.springframework.data.repository.query.Param("username") String username, @org.springframework.data.repository.query.Param("cutoffDate") LocalDate cutoffDate);
}