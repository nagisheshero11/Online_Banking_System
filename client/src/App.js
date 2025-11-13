import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all components
import LandingPage from './components/LandingPage';
import DashboardPage from './components/Dashboard';
// Dashboard overview removed; default route will redirect to account details
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
import ApplyCard from './components/ApplyCard/ApplyCard';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard routes (with nested child pages) */}
          <Route path="/dashboard" element={<DashboardPage />}>
            {/* Default dashboard overview removed -> redirect to account details */}
            <Route index element={<Navigate to="account-details" replace />} />

            {/* Nested dashboard pages */}
            <Route path="pay-bills" element={<PayBills />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cards" element={<Cards />} />
            <Route path="apply-card" element={<ApplyCard />} />
            <Route path="account-details" element={<AccountDetails />} />
            <Route path="loan-status" element={<LoanStatus />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="deposit-money" element={<DepositMoney />} />
            <Route path="transfer-money" element={<TransferMoney />} />
            <Route path="request-loan" element={<RequestLoan />} />
          </Route>

          {/* Authentication routes */}
          <Route path="/login" element={<LoginOverlayPage />} />
          <Route path="/signup" element={<SignupOverlayPage />} />

          {/* Redirect any unknown route back to home */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
