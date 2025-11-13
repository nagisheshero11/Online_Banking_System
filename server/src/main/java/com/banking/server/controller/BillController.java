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
     * Admin-only (Postman) create bill
     * Not protected so you can add manually from Postman
     */
    @PostMapping("/create")
    public Bill createBill(@RequestBody Bill bill) {
        return billService.createBill(bill);
    }

    /**
     * 🔐 Get logged-in user's bills
     */
    @GetMapping("/my")
    public List<Bill> getMyBills(Authentication auth) {
        String username = auth.getName();  // from JWT token
        return billService.getBillsForUser(username);
    }

    /**
     * 🔐 Pay (delete) logged-in user's bill
     */
    @DeleteMapping("/{id}")
    public String payMyBill(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        billService.payUserBill(id, username);
        return "Bill paid & removed successfully";
    }
}