package com.banking.server.controller;

import com.banking.server.dto.TransferRequest;
import com.banking.server.dto.TransferResponse;
import com.banking.server.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class TransferController {

    @Autowired
    private TransferService transferService;

    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(Authentication authentication,
                                           @RequestBody TransferRequest request) {
        String username = authentication.getName();
        try {
            TransferResponse response = transferService.transfer(username, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            String msg = e.getMessage() == null ? "Transfer failed." : e.getMessage();
            if (msg.toLowerCase().contains("not found"))
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Transfer failed: " + e.getMessage());
        }
    }
}
