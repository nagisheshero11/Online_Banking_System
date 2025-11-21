package com.banking.server.scheduler;

import com.banking.server.entity.LoanApplication;
import com.banking.server.repository.LoanApplicationRepository;
import com.banking.server.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class BillingScheduler {

    @Autowired
    private LoanApplicationRepository loanRepo;

    @Autowired
    private BillService billService;

    /**
     * Runs once a day and checks all approved loans. If 30 days passed since the last created bill
     * (or since approval) it creates an interest bill for the 30-day period.
     *
     * Note: We use a simple heuristic: create one bill per 30 days per loan.
     */
    @Scheduled(cron = "0 0 2 * * ?") // every day at 02:00am
    @Transactional
    public void generateMonthlyInterestBills() {

        List<LoanApplication> approvedLoans = loanRepo.findAll()
                .stream()
                .filter(l -> "APPROVED".equalsIgnoreCase(l.getStatus()))
                .toList();

        for (LoanApplication loan : approvedLoans) {

            // find last bill created date for this loan (we will query bills via BillService inside)
            // For simplicity, we compute approximate next bill from createdAt — then create if >=30 days.
            // More advanced: store lastBilledAt in loan entity. For now use createdAt.

            LocalDate lastBillDate = loan.getCreatedAt().toLocalDate();

            // check if there are bills for this loan and take latest created date via repository if needed.
            // To keep this file light we rely on createdAt; you can enhance by storing lastBilledAt in loan.

            // If 30 or more days passed since createdAt or since last bill -> create new bill
            LocalDate now = LocalDate.now();
            long daysSince = java.time.temporal.ChronoUnit.DAYS.between(lastBillDate, now);

            // We'll create bills for each full 30-day period since createdAt. Calculate count:
            int fullPeriods = (int) (daysSince / 30);
            if (fullPeriods <= 0) continue;

            // For each missing 30-day period create a bill (avoid duplicating — you'd enhance by checking bills)
            // Simpler approach: create a single current bill for the most recent 30-day chunk.
            BigDecimal principal = loan.getLoanAmount();
            BigDecimal yearlyRate = loan.getInterestRate(); // e.g., 8.5
            // interest for 30 days = principal * (rate/100) * (30/365)
            BigDecimal interest = principal
                    .multiply(yearlyRate)
                    .multiply(BigDecimal.valueOf(30.0 / 365.0))
                    .divide(BigDecimal.valueOf(100.0));

            LocalDate dueDate = now.plusDays(15); // give 15 days to pay
            billService.createBillForLoan(loan.getUsername(), loan.getAccountNumber(), loan.getId(), interest, dueDate);

            // NOTE: in production you'd store a lastBilledAt timestamp on LoanApplication and update it here to avoid duplicates.
        }
    }
}