package com.banking.server.controller;

import com.banking.server.entity.Bill;
import com.banking.server.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    /**
     * GET /api/bills/my
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyBills(Authentication authentication) {
        String username = authentication.getName();
        List<Bill> bills = billService.getBillsForUser(username);
        return ResponseEntity.ok(bills);
    }

    /**
     * POST /api/bills/pay/{id}
     */
    @PostMapping("/pay/{id}")
    public ResponseEntity<?> payBill(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Bill paid = billService.payBill(id, username);
        return ResponseEntity.ok(paid);
    }

    /**
     * GET /api/bills/loan/{loanId}
     * Returns all bills linked to a specific loan
     */
    @GetMapping("/loan/{loanId}")
    public ResponseEntity<?> getBillsByLoan(@PathVariable Long loanId,
                                            Authentication authentication) {

        String username = authentication.getName();

        List<Bill> bills = billService.getBillsByLoan(loanId, username);

        return ResponseEntity.ok(bills);
    }
}