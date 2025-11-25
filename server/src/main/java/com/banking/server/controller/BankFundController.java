package com.banking.server.controller;

import com.banking.server.entity.BankFund;
import com.banking.server.entity.BankTransaction;
import com.banking.server.service.BankFundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bank-funds")
public class BankFundController {

    @Autowired
    private BankFundService bankFundService;

    @GetMapping
    public ResponseEntity<BankFund> getBankFunds() {
        return ResponseEntity.ok(bankFundService.getBankFunds());
    }

    @GetMapping("/history")
    public ResponseEntity<List<BankTransaction>> getHistory() {
        return ResponseEntity.ok(bankFundService.getHistory());
    }
}
