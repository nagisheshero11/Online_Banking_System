package com.banking.server.controller;

import com.banking.server.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    /**
     * Get comprehensive dashboard analytics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        Map<String, Object> analytics = adminAnalyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
