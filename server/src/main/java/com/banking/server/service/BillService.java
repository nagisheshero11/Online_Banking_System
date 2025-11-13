package com.banking.server.service;

import com.banking.server.entity.Bill;
import com.banking.server.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    // Admin-only: create bill
    public Bill createBill(Bill bill) {
        bill.setPaid(false);
        return billRepository.save(bill);
    }

    // Logged-in user.
    public List<Bill> getBillsForUser(String username) {
        return billRepository.findByUsername(username);
    }

    // Secure pay/delete
    public void payUserBill(Long id, String username) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        // Prevent user accessing others' bills
        if (!bill.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: You cannot modify another user's bill");
        }

        billRepository.delete(bill);
    }
}