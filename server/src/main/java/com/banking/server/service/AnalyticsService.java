package com.banking.server.service;

import com.banking.server.entity.Transaction;
import com.banking.server.entity.User;
import com.banking.server.repository.TransactionRepository;
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
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get monthly analytics for a user
     */
    public Map<String, Object> getUserMonthlyAnalytics(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accountNumber = user.getAccountNumber();

        // Get current month's start and end
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        // Get all transactions for the user in current month
        List<Transaction> allTransactions = transactionRepository.findAll();
        List<Transaction> monthlyTransactions = allTransactions.stream()
                .filter(t -> {
                    LocalDateTime createdAt = t.getCreatedAt();
                    return createdAt != null &&
                            !createdAt.isBefore(startOfMonth) &&
                            !createdAt.isAfter(endOfMonth) &&
                            (accountNumber.equals(t.getFromAccountNumber()) ||
                                    accountNumber.equals(t.getToAccountNumber()));
                })
                .collect(Collectors.toList());

        // Calculate totals
        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;
        int debitCount = 0;
        int creditCount = 0;

        for (Transaction txn : monthlyTransactions) {
            if (accountNumber.equals(txn.getFromAccountNumber())) {
                totalDebits = totalDebits.add(txn.getAmount());
                debitCount++;
            } else if (accountNumber.equals(txn.getToAccountNumber())) {
                totalCredits = totalCredits.add(txn.getAmount());
                creditCount++;
            }
        }

        // Daily trends
        Map<Integer, BigDecimal> dailyDebits = new TreeMap<>();
        Map<Integer, BigDecimal> dailyCredits = new TreeMap<>();

        for (int day = 1; day <= currentMonth.lengthOfMonth(); day++) {
            dailyDebits.put(day, BigDecimal.ZERO);
            dailyCredits.put(day, BigDecimal.ZERO);
        }

        for (Transaction txn : monthlyTransactions) {
            int day = txn.getCreatedAt().getDayOfMonth();
            if (accountNumber.equals(txn.getFromAccountNumber())) {
                dailyDebits.put(day, dailyDebits.get(day).add(txn.getAmount()));
            } else if (accountNumber.equals(txn.getToAccountNumber())) {
                dailyCredits.put(day, dailyCredits.get(day).add(txn.getAmount()));
            }
        }

        // Build daily trend data
        List<Map<String, Object>> dailyTrends = new ArrayList<>();
        for (int day = 1; day <= currentMonth.lengthOfMonth(); day++) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", day);
            dayData.put("debits", dailyDebits.get(day));
            dayData.put("credits", dailyCredits.get(day));
            dailyTrends.add(dayData);
        }

        // Build response
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalDebits", totalDebits);
        analytics.put("totalCredits", totalCredits);
        analytics.put("debitCount", debitCount);
        analytics.put("creditCount", creditCount);
        analytics.put("totalTransactions", monthlyTransactions.size());
        analytics.put("dailyTrends", dailyTrends);
        analytics.put("month", currentMonth.getMonth().toString());
        analytics.put("year", currentMonth.getYear());

        return analytics;
    }
}
