package com.banking.server.service;

import com.banking.server.entity.Transaction;
import com.banking.server.entity.Card;
import com.banking.server.entity.User;
import com.banking.server.repository.TransactionRepository;
import com.banking.server.repository.CardRepository;
import com.banking.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CardRepository cardRepository;

    /**
     * Get comprehensive dashboard analytics for admin
     */
    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Total Users
        long totalUsers = userRepository.count();
        analytics.put("totalUsers", totalUsers);

        // User Growth (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<User> allUsers = userRepository.findAll();

        Map<LocalDate, Long> userGrowth = new TreeMap<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            userGrowth.put(date, 0L);
        }

        for (User user : allUsers) {
            if (user.getCreatedAt() != null && user.getCreatedAt().isAfter(thirtyDaysAgo)) {
                LocalDate date = user.getCreatedAt().toLocalDate();
                userGrowth.put(date, userGrowth.getOrDefault(date, 0L) + 1);
            }
        }

        List<Map<String, Object>> userGrowthData = new ArrayList<>();
        for (Map.Entry<LocalDate, Long> entry : userGrowth.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", entry.getKey().toString());
            dataPoint.put("users", entry.getValue());
            userGrowthData.add(dataPoint);
        }
        analytics.put("userGrowth", userGrowthData);

        // Transaction Analytics
        List<Transaction> allTransactions = transactionRepository.findAll();
        analytics.put("totalTransactions", allTransactions.size());

        // Transaction volume (last 30 days)
        Map<LocalDate, Integer> transactionVolume = new TreeMap<>();
        Map<LocalDate, BigDecimal> transactionAmount = new TreeMap<>();

        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            transactionVolume.put(date, 0);
            transactionAmount.put(date, BigDecimal.ZERO);
        }

        for (Transaction txn : allTransactions) {
            if (txn.getCreatedAt() != null && txn.getCreatedAt().isAfter(thirtyDaysAgo)) {
                LocalDate date = txn.getCreatedAt().toLocalDate();
                transactionVolume.put(date, transactionVolume.getOrDefault(date, 0) + 1);
                transactionAmount.put(date,
                        transactionAmount.getOrDefault(date, BigDecimal.ZERO).add(txn.getAmount()));
            }
        }

        List<Map<String, Object>> volumeData = new ArrayList<>();
        for (Map.Entry<LocalDate, Integer> entry : transactionVolume.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", entry.getKey().toString());
            dataPoint.put("count", entry.getValue());
            dataPoint.put("amount", transactionAmount.get(entry.getKey()));
            volumeData.add(dataPoint);
        }
        analytics.put("transactionVolume", volumeData);

        // Card Statistics
        List<Card> allCards = cardRepository.findAll();
        long totalCards = allCards.size();
        long activeCards = allCards.stream().filter(c -> "ACTIVE".equals(c.getStatus())).count();
        long pendingCards = allCards.stream().filter(c -> "PENDING".equals(c.getStatus())).count();

        Map<String, Object> cardStats = new HashMap<>();
        cardStats.put("total", totalCards);
        cardStats.put("active", activeCards);
        cardStats.put("pending", pendingCards);
        analytics.put("cardStats", cardStats);

        // Revenue from card fees (simplified - counting approved cards)
        Map<String, Integer> cardTypeCount = new HashMap<>();
        cardTypeCount.put("SIGNATURE_CREDIT", 0);
        cardTypeCount.put("NORMAL_CREDIT", 0);
        cardTypeCount.put("PLATINUM_DEBIT", 0);

        for (Card card : allCards) {
            if ("ACTIVE".equals(card.getStatus()) || "APPROVED".equals(card.getStatus())) {
                String type = card.getCardType();
                cardTypeCount.put(type, cardTypeCount.getOrDefault(type, 0) + 1);
            }
        }

        BigDecimal cardRevenue = BigDecimal.ZERO;
        cardRevenue = cardRevenue.add(BigDecimal.valueOf(cardTypeCount.get("SIGNATURE_CREDIT") * 2999));
        cardRevenue = cardRevenue.add(BigDecimal.valueOf(cardTypeCount.get("NORMAL_CREDIT") * 499));
        // Platinum debit is free

        analytics.put("estimatedCardRevenue", cardRevenue);

        // Transaction type breakdown
        Map<String, Integer> transactionTypes = new HashMap<>();
        transactionTypes.put("TRANSFER", 0);
        transactionTypes.put("CARD_PAYMENT", 0);
        transactionTypes.put("LOAN", 0);
        transactionTypes.put("OTHER", 0);

        for (Transaction txn : allTransactions) {
            String type = txn.getRemarks() != null && txn.getRemarks().contains("Card") ? "CARD_PAYMENT" : "TRANSFER";
            transactionTypes.put(type, transactionTypes.getOrDefault(type, 0) + 1);
        }

        analytics.put("transactionTypeBreakdown", transactionTypes);

        return analytics;
    }
}
