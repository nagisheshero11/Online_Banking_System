package com.banking.server.controller;

import com.banking.server.entity.Bill;
import com.banking.server.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    /**
     * ADMIN → Create a bill for a specific user through POSTMAN
     */
    @PostMapping("/create")
    public Bill createBill(@RequestBody Bill bill) {
        return billService.createBill(bill);
    }

    /**
     * USER → Fetch logged-in user's bills
     */
    @GetMapping("/my")
    public List<Bill> getMyBills(Authentication authentication) {
        String username = authentication.getName();
        return billService.getBillsForUser(username);
    }

    /**
     * USER → Pay a specific bill
     */
    @PostMapping("/pay/{billId}")
    public String payBill(@PathVariable Long billId, Authentication authentication) {
        String username = authentication.getName();
        billService.payBill(billId, username);
        return "Bill paid successfully";
    }
}