package com.banking.server.service;

import com.banking.server.entity.Bill;
import com.banking.server.entity.LoanApplication;
import com.banking.server.entity.Account;
import com.banking.server.entity.Transaction;
import com.banking.server.repository.BillRepository;
import com.banking.server.repository.AccountRepository;
import com.banking.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BankFundService bankFundService;

    @Autowired
    private com.banking.server.repository.CardRepository cardRepository;

    public List<Bill> getBillsForUser(String username) {
        // Show EMIs only if due within next 30 days
        LocalDate cutoffDate = LocalDate.now().plusDays(30);
        return billRepository.findUpcomingBills(username, cutoffDate);
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    @Transactional
    public Bill createBill(Bill bill) {
        return billRepository.save(bill);
    }

    /**
     * Pay a bill: will debit user's account balance (pessimistic lock) and mark
     * bill as PAID.
     */
    @Transactional
    public Bill payBill(Long billId, String username) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (!bill.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to pay this bill");
        }

        if (!"UNPAID".equalsIgnoreCase(bill.getStatus())) {
            throw new RuntimeException("Bill is not unpaid");
        }

        // Fetch account with lock
        Account account;
        if ("CREDIT_CARD".equals(bill.getBillType())) {
            // For Credit Card bills, debit the user's main account
            account = accountRepository.findByUsernameForUpdate(username)
                    .orElseThrow(() -> new RuntimeException("User account not found"));

            // Also update the Card's used amount
            if (bill.getCardId() != null) {
                com.banking.server.entity.Card card = cardRepository.findById(bill.getCardId())
                        .orElseThrow(() -> new RuntimeException("Card not found"));

                // Reduce used amount
                BigDecimal newUsed = card.getUsedAmount().subtract(bill.getAmount());
                if (newUsed.compareTo(BigDecimal.ZERO) < 0) {
                    newUsed = BigDecimal.ZERO;
                }
                card.setUsedAmount(newUsed);
                cardRepository.save(card);
            }
        } else {
            // For EMI/Manual, debit the account specified in the bill (usually user's
            // account)
            account = accountRepository.findByAccountNumberForUpdate(bill.getAccountNumber())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
        }

        BigDecimal balance = account.getBalance();
        if (balance.compareTo(bill.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance to pay bill");
        }

        account.setBalance(balance.subtract(bill.getAmount()));
        accountRepository.save(account);

        bill.setStatus("PAID");
        bill.setPaid(true);
        Bill savedBill = billRepository.save(bill);

        // Create transaction record for bill payment
        Transaction transaction = Transaction.builder()
                .fromAccountNumber(account.getAccountNumber())
                .toAccountNumber("BILL_PAYMENT")
                .amount(bill.getAmount())
                .remarks("Bill Payment #" + bill.getId() + " - " + bill.getBillType())
                .status("COMPLETED")
                .fromBalanceAfter(account.getBalance())
                .toBalanceAfter(null)
                .build();

        transactionRepository.save(transaction);

        // Credit Bank Funds if EMI or CREDIT_CARD
        if ("EMI".equalsIgnoreCase(bill.getBillType()) || "CREDIT_CARD".equalsIgnoreCase(bill.getBillType())) {
            bankFundService.creditFunds(bill.getAmount(), bill.getBillType() + " Payment - Bill #" + bill.getId());
        }

        // Check for Loan Completion
        if ("EMI".equalsIgnoreCase(bill.getBillType()) && bill.getLoanId() != null) {
            checkAndCompleteLoan(bill.getLoanId());
        }

        return savedBill;
    }

    /**
     * Generate monthly EMI bills for a loan application.
     */
    @Transactional
    public void generateMonthlyEmiBills(LoanApplication loan, String username, String accountNumber) {

        BigDecimal principal = loan.getLoanAmount();
        BigDecimal annualRate = loan.getInterestRate(); // percent
        int tenureMonths = loan.getTenureMonths();

        // monthlyInterestRate = annualRate / 12 / 100
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, BigDecimal.ROUND_HALF_UP);

        // EMI formula
        BigDecimal onePlusRPowerN = BigDecimal.ONE.add(monthlyRate).pow(tenureMonths);
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusRPowerN);
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);

        BigDecimal emi = numerator.divide(denominator, 2, BigDecimal.ROUND_HALF_UP);

        LocalDate nextDue = LocalDate.now().plusMonths(1);

        for (int i = 0; i < tenureMonths; i++) {

            Bill bill = Bill.builder()
                    .username(username)
                    .accountNumber(accountNumber)
                    .loanId(loan.getId())
                    .amount(emi)
                    .dueDate(nextDue.plusMonths(i))
                    .status("UNPAID")
                    .billType("EMI") // REQUIRED
                    .paid(false) // REQUIRED
                    .build();

            billRepository.save(bill);
        }
    }

    public List<Bill> getBillsByLoan(Long loanId, String username) {
        return billRepository.findByLoanIdAndUsername(loanId, username);
    }

    @Transactional
    public Bill createBillForLoan(String username,
            String accountNumber,
            Long loanId,
            BigDecimal amount,
            LocalDate dueDate) {

        Bill bill = Bill.builder()
                .username(username)
                .accountNumber(accountNumber)
                .loanId(loanId)
                .amount(amount)
                .dueDate(dueDate)
                .status("UNPAID")
                .billType("MANUAL")
                .paid(false)
                .build();

        return billRepository.save(bill);
    }

    @Transactional
    public Bill generateCreditCardBill(com.banking.server.entity.Card card) {
        BigDecimal totalDue = card.getUsedAmount();
        if (totalDue.compareTo(BigDecimal.ZERO) <= 0) {
            return null; // No bill needed if nothing used
        }

        // Check for existing UNPAID bill
        List<Bill> unpaidBills = billRepository.findByCardIdAndStatus(card.getId(), "UNPAID");
        if (!unpaidBills.isEmpty()) {
            // Update existing bill
            Bill existingBill = unpaidBills.get(0);
            existingBill.setAmount(totalDue);
            existingBill.setMinimumDue(totalDue.multiply(new BigDecimal("0.05")));
            // We keep the original due date to enforce payment timeline
            return billRepository.save(existingBill);
        }

        // Minimum Due = 5% of Total Due
        BigDecimal minimumDue = totalDue.multiply(new BigDecimal("0.05"));

        // Due Date = 20 days from now
        LocalDate dueDate = LocalDate.now().plusDays(20);

        Bill bill = Bill.builder()
                .username(card.getUser().getUsername())
                .accountNumber(card.getCardNumber()) // Use Card Number as account reference
                .cardId(card.getId())
                .amount(totalDue)
                .minimumDue(minimumDue)
                .dueDate(dueDate)
                .status("UNPAID")
                .billType("CREDIT_CARD")
                .paid(false)
                .build();

        return billRepository.save(bill);
    }

    @Transactional
    public void generateBillsForEligibleCards() {
        List<com.banking.server.entity.Card> cards = cardRepository.findAll();
        for (com.banking.server.entity.Card card : cards) {
            if ("ACTIVE".equals(card.getStatus()) && card.getCardType().contains("CREDIT")) {
                // Check last bill date
                Optional<Bill> lastBill = billRepository.findTopByCardIdOrderByCreatedAtDesc(card.getId());
                boolean shouldGenerate = false;

                if (lastBill.isEmpty()) {
                    // Never billed, check if used amount > 0
                    if (card.getUsedAmount().compareTo(BigDecimal.ZERO) > 0) {
                        shouldGenerate = true;
                    }
                } else {
                    // Check if 30 days passed since last bill
                    // Using createdAt for cycle calculation
                    if (lastBill.get().getCreatedAt().toLocalDate().plusDays(30).isBefore(LocalDate.now()) ||
                            lastBill.get().getCreatedAt().toLocalDate().plusDays(30).isEqual(LocalDate.now())) {
                        shouldGenerate = true;
                    }
                }

                if (shouldGenerate) {
                    generateCreditCardBill(card);
                }
            }
        }
    }

    @Transactional
    public Bill payBillWithCard(Long billId, Long cardId, String pin, String username) {
        // 1. Fetch Bill
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (!bill.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to pay this bill");
        }

        if (!"UNPAID".equalsIgnoreCase(bill.getStatus())) {
            throw new RuntimeException("Bill is not unpaid");
        }

        // 2. Fetch Card
        com.banking.server.entity.Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!card.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Card does not belong to user");
        }

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new RuntimeException("Card is not active");
        }

        // 3. Validate PIN
        if (card.getPin() == null || !card.getPin().equals(pin)) {
            throw new RuntimeException("Invalid PIN");
        }

        // 4. Validate Limits
        BigDecimal amount = bill.getAmount();

        // Per Transaction Limit
        if (card.getPerTransactionLimit() != null && amount.compareTo(card.getPerTransactionLimit()) > 0) {
            throw new RuntimeException("Amount exceeds per-transaction limit");
        }

        // Daily Limit
        LocalDate today = LocalDate.now();
        if (!today.equals(card.getLastUsageDate())) {
            card.setDailyUsage(BigDecimal.ZERO);
            card.setLastUsageDate(today);
        }
        if (card.getDailyLimit() != null && card.getDailyUsage().add(amount).compareTo(card.getDailyLimit()) > 0) {
            throw new RuntimeException("Daily limit exceeded");
        }

        // 5. Process Payment based on Card Type
        if (card.getCardType().contains("CREDIT")) {
            // Credit Card Logic
            if (card.getCreditLimit() != null
                    && card.getUsedAmount().add(amount).compareTo(card.getCreditLimit()) > 0) {
                throw new RuntimeException("Insufficient credit limit");
            }
            card.setUsedAmount(card.getUsedAmount().add(amount));
        } else {
            // Debit Card Logic
            Account userAccount = card.getUser().getAccount();
            if (userAccount == null) {
                throw new RuntimeException("No linked account found for this debit card");
            }
            // Lock account for update
            Account lockedAccount = accountRepository.findByAccountNumberForUpdate(userAccount.getAccountNumber())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (lockedAccount.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient funds in linked account");
            }
            lockedAccount.setBalance(lockedAccount.getBalance().subtract(amount));
            accountRepository.save(lockedAccount);
        }

        // Update Card Usage Stats
        card.setDailyUsage(card.getDailyUsage().add(amount));
        cardRepository.save(card);

        // 6. Mark Bill as Paid
        bill.setStatus("PAID");
        bill.setPaid(true);
        Bill savedBill = billRepository.save(bill);

        // 7. Create Transaction Record
        Transaction transaction = Transaction.builder()
                .fromAccountNumber(card.getCardNumber())
                .toAccountNumber("BILL_PAYMENT")
                .amount(amount)
                .remarks("Bill Payment #" + bill.getId() + " via Card "
                        + card.getCardNumber().substring(card.getCardNumber().length() - 4))
                .status("COMPLETED")
                .fromBalanceAfter(card.getCardType().contains("CREDIT")
                        ? card.getCreditLimit().subtract(card.getUsedAmount())
                        : card.getUser().getAccount().getBalance())
                .toBalanceAfter(null)
                .build();

        transactionRepository.save(transaction);

        // Credit Bank Funds
        bankFundService.creditFunds(amount, bill.getBillType() + " Payment via Card - Bill #" + bill.getId());

        // Check for Loan Completion
        if ("EMI".equalsIgnoreCase(bill.getBillType()) && bill.getLoanId() != null) {
            checkAndCompleteLoan(bill.getLoanId());
        }

        return savedBill;
    }

    @Autowired
    private com.banking.server.repository.LoanApplicationRepository loanRepository;

    private void checkAndCompleteLoan(Long loanId) {
        // Check if there are any UNPAID bills for this loan
        // loanId only or filter
        // Actually we have findByLoanId in repo
        List<Bill> allLoanBills = billRepository.findByLoanId(loanId);

        boolean allPaid = allLoanBills.stream().allMatch(Bill::isPaid);

        if (allPaid) {
            LoanApplication loan = loanRepository.findById(loanId).orElse(null);
            if (loan != null && "APPROVED".equals(loan.getStatus())) {
                loan.setStatus("COMPLETED");
                loanRepository.save(loan);
            }
        }
    }
}