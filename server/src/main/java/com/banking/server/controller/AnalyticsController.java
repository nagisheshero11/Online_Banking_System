package com.banking.server.controller;

import com.banking.server.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Get monthly analytics for logged-in user
     */
    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyAnalytics(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> analytics = analyticsService.getUserMonthlyAnalytics(username);
        return ResponseEntity.ok(analytics);
    }
}
