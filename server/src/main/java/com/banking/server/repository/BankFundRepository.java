package com.banking.server.repository;

import com.banking.server.entity.BankFund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankFundRepository extends JpaRepository<BankFund, Long> {
}
