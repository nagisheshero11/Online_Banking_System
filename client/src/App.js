import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// User Components
import LandingPage from './components/LandingPage';
import DashboardPage from './components/Dashboard';
import LoginOverlayPage from './components/Auth/LoginOverlayPage';
import SignupOverlayPage from './components/Auth/SignupOverlayPage';
import AccountDetails from './components/AccountDetails/AccountDetails';
import LoanStatus from './components/LoanStatus/LoanStatus';
import Transaction from './components/Transaction/Transaction';
import DepositMoney from './components/DepositMoney/DepositMoney';
import TransferMoney from './components/TransferMoney/TransferMoney';
import RequestLoan from './components/RequestLoan/RequestLoan';
import PayBills from './components/PayBills/PayBills';
import Profile from './components/Profile/Profile';
import Cards from './components/Cards/Cards';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ApproveCards from './admin/ApproveCards';
import ApproveLoans from './admin/ApproveLoans';
import BankFunds from './admin/BankFunds';
import HistoryCards from './admin/HistoryCards';
import HistoryLoans from './admin/HistoryLoans';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* USER DASHBOARD */}
          <Route path="/dashboard" element={<DashboardPage />}>
            {/* Default → account details */}
            <Route index element={<Navigate to="account-details" replace />} />

            {/* User nested routes */}
            <Route path="account-details" element={<AccountDetails />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="deposit-money" element={<DepositMoney />} />
            <Route path="transfer-money" element={<TransferMoney />} />
            <Route path="pay-bills" element={<PayBills />} />
            <Route path="cards" element={<Cards />} />
            <Route path="request-loan" element={<RequestLoan />} />
            <Route path="loan-status" element={<LoanStatus />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* LOGIN & SIGNUP */}
          <Route path="/login" element={<LoginOverlayPage />} />
          <Route path="/signup" element={<SignupOverlayPage />} />

          {/* ADMIN DASHBOARD */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Default → dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approve-cards" element={<ApproveCards />} />
            <Route path="approve-loans" element={<ApproveLoans />} />
            <Route path="bank-funds" element={<BankFunds />} />

            {/* History */}
            <Route path="history/cards" element={<HistoryCards />} />
            <Route path="history/loans" element={<HistoryLoans />} />
          </Route>

          {/* Catch-all route → redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;