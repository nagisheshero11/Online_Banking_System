package com.banking.server.service;

import com.banking.server.entity.Card;
import com.banking.server.entity.User;
import com.banking.server.repository.CardRepository;
import com.banking.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    public Card applyForCard(String username, String cardType) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate mock card details
        String cardNumber = generateCardNumber();
        String cvv = String.format("%03d", new Random().nextInt(1000));
        String expiry = "12/29"; // Mock expiry

        Card card = Card.builder()
                .user(user)
                .cardType(cardType)
                .cardNumber(cardNumber)
                .cardHolder(user.getFirstName().toUpperCase() + " " + user.getLastName().toUpperCase())
                .expiryDate(expiry)
                .cvv(cvv)
                .status("PENDING")
                .build();

        return cardRepository.save(card);
    }

    public List<Card> getMyCards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cardRepository.findByUserId(user.getId());
    }

    public List<Card> getPendingApplications() {
        return cardRepository.findByStatus("PENDING");
    }

    public Card approveCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus("ACTIVE");
        return cardRepository.save(card);
    }

    public void rejectCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus("REJECTED");
        cardRepository.save(card);
    }

    public Card blockCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus("BLOCKED");
        return cardRepository.save(card);
    }

    public Card unblockCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        if (!"BLOCKED".equals(card.getStatus())) {
            throw new RuntimeException("Only blocked cards can be unblocked");
        }
        
        card.setStatus("ACTIVE");
        return cardRepository.save(card);
    }

    public void setPin(Long cardId, String pin) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setPin(pin);
        cardRepository.save(card);
    }

    private String generateCardNumber() {
        Random rand = new Random();
        StringBuilder sb = new StringBuilder("4"); // Visa starts with 4
        for (int i = 0; i < 15; i++) {
            sb.append(rand.nextInt(10));
        }
        // Format: XXXX XXXX XXXX XXXX
        return sb.toString().replaceAll("(.{4})", "$1 ").trim();
    }
}
