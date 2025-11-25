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
     * Pay a bill: will debit user's account balance (pessimistic lock) and mark bill as PAID.
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
        Account account = accountRepository.findByAccountNumberForUpdate(bill.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

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

        // Credit Bank Funds if EMI
        if ("EMI".equalsIgnoreCase(bill.getBillType())) {
            bankFundService.creditFunds(bill.getAmount(), "EMI Payment - Bill #" + bill.getId());
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
                    .billType("EMI")    // REQUIRED
                    .paid(false)        // REQUIRED
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
}