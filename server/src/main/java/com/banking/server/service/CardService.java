package com.banking.server.service;

import com.banking.server.entity.Card;
import com.banking.server.entity.User;
import com.banking.server.repository.CardRepository;
import com.banking.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.math.BigDecimal;

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

        // Set Limits based on Type
        if ("SIGNATURE_CREDIT".equals(card.getCardType())) {
            card.setCreditLimit(new BigDecimal("5000000")); // 50L Total Limit
            card.setDailyLimit(new BigDecimal("2000000")); // 20L Daily
            card.setPerTransactionLimit(new BigDecimal("200000")); // 2L Per Txn
        } else if ("NORMAL_CREDIT".equals(card.getCardType())) {
            card.setCreditLimit(new BigDecimal("1000000")); // 10L Total Limit
            card.setDailyLimit(new BigDecimal("1000000")); // 10L Daily
            card.setPerTransactionLimit(new BigDecimal("100000")); // 1L Per Txn
        }

        // Initialize Usage
        if (card.getCardType().contains("CREDIT")) {
            card.setUsedAmount(BigDecimal.ZERO);
            card.setDailyUsage(BigDecimal.ZERO);
            card.setLastUsageDate(java.time.LocalDate.now());
        }

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

    @Autowired
    private com.banking.server.service.BillService billService;

    public void simulateTransaction(Long cardId, BigDecimal amount) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new RuntimeException("Card is not active");
        }

        if (!card.getCardType().contains("CREDIT")) {
            throw new RuntimeException("Transaction simulation only for Credit Cards");
        }

        // 1. Check Per Transaction Limit
        if (amount.compareTo(card.getPerTransactionLimit()) > 0) {
            throw new RuntimeException("Transaction exceeds limit of " + card.getPerTransactionLimit());
        }

        // 2. Check Daily Limit
        java.time.LocalDate today = java.time.LocalDate.now();
        if (!today.equals(card.getLastUsageDate())) {
            card.setDailyUsage(BigDecimal.ZERO);
            card.setLastUsageDate(today);
        }
        if (card.getDailyUsage().add(amount).compareTo(card.getDailyLimit()) > 0) {
            throw new RuntimeException(
                    "Daily limit exceeded. Remaining: " + card.getDailyLimit().subtract(card.getDailyUsage()));
        }

        // 3. Check Credit Limit
        if (card.getUsedAmount().add(amount).compareTo(card.getCreditLimit()) > 0) {
            throw new RuntimeException("Insufficient credit limit");
        }

        // Update Usage
        card.setUsedAmount(card.getUsedAmount().add(amount));
        card.setDailyUsage(card.getDailyUsage().add(amount));
        cardRepository.save(card);
    }

    public void generateBill(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (card.getUsedAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("No used amount to generate bill");
        }

        billService.generateCreditCardBill(card);
    }
}
