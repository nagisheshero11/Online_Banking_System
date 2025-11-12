package com.banking.server.controller;

import com.banking.server.entity.Account;
import com.banking.server.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/me")
    public Optional<Account> getAccountByUsername(Authentication authentication) {
        String username = authentication.getName();
        return accountRepository.findByUsername(username);
    }

    @GetMapping("/all")
    public Iterable<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
}