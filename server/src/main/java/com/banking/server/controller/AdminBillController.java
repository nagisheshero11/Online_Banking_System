package com.banking.server.controller;

import com.banking.server.dto.BillRequestDTO;
import com.banking.server.entity.Bill;
import com.banking.server.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bills")
public class AdminBillController {

    @Autowired
    private BillService billService;

    @PostMapping("/create")
    public ResponseEntity<?> createBill(@RequestBody BillRequestDTO request) {
        try {
            Bill bill = Bill.builder()
                    .username(request.getUsername())
                    .accountNumber(request.getAccountNumber())
                    .amount(request.getAmount())
                    .dueDate(request.getDueDate())
                    .billType(request.getBillType())
                    .status("UNPAID")
                    .paid(false)
                    .build();

            Bill savedBill = billService.createBill(bill);
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating bill: " + e.getMessage());
        }
    }
}
