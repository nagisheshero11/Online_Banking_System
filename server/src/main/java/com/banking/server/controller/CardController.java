package com.banking.server.controller;

import com.banking.server.entity.Card;
import com.banking.server.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForCard(@RequestBody Map<String, String> payload, Authentication authentication) {
        String cardType = payload.get("cardType");
        Card card = cardService.applyForCard(authentication.getName(), cardType);
        return ResponseEntity.ok(card);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyCards(Authentication authentication) {
        List<Card> cards = cardService.getMyCards(authentication.getName());
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/{id}/block")
    public ResponseEntity<?> blockCard(@PathVariable Long id) {
        Card card = cardService.blockCard(id);
        return ResponseEntity.ok(card);
    }

    @PostMapping("/{id}/unblock")
    public ResponseEntity<?> unblockCard(@PathVariable Long id) {
        Card card = cardService.unblockCard(id);
        return ResponseEntity.ok(card);
    }

    @PostMapping("/{id}/set-pin")
    public ResponseEntity<?> setPin(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String pin = payload.get("pin");
        cardService.setPin(id, pin);
        return ResponseEntity.ok("PIN set successfully");
    }

    @PostMapping("/{id}/bill")
    public ResponseEntity<?> generateBill(@PathVariable Long id) {
        cardService.generateBill(id);
        return ResponseEntity.ok("Bill generated successfully");
    }
}
