package com.banking.server.scheduler;

import com.banking.server.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BillScheduler {

    @Autowired
    private BillService billService;

    /**
     * Run daily at midnight to generate bills for eligible credit cards.
     * Cron expression: "0 0 0 * * ?" (At 00:00:00am every day)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduleBillGeneration() {
        System.out.println("Running scheduled task: Generating Credit Card Bills...");
        billService.generateBillsForEligibleCards();
        System.out.println("Scheduled task completed.");
    }
}
