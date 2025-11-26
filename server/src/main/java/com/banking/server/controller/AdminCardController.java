package com.banking.server.controller;

import com.banking.server.entity.Card;
import com.banking.server.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cards")
public class AdminCardController {

    @Autowired
    private CardService cardService;

    @GetMapping("/applications")
    public ResponseEntity<?> getPendingApplications() {
        List<Card> cards = cardService.getPendingApplications();
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveCard(@PathVariable Long id) {
        Card card = cardService.approveCard(id);
        return ResponseEntity.ok(card);
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectCard(@PathVariable Long id) {
        cardService.rejectCard(id);
        return ResponseEntity.ok("Card rejected");
    }
}
