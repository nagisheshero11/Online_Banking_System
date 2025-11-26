package com.banking.server.controller;

import com.banking.server.service.CardPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/card-payment")
public class CardPaymentController {

    @Autowired
    private CardPaymentService cardPaymentService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMoney(@RequestBody Map<String, Object> request) {
        try {
            Long cardId = Long.valueOf(request.get("cardId").toString());
            String toAccount = (String) request.get("toAccount");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String remarks = (String) request.get("remarks");

            cardPaymentService.processPayment(cardId, toAccount, amount, remarks);
            return ResponseEntity.ok("Payment Successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
