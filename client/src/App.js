import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all components
import LandingPage from './components/LandingPage';
import DashboardPage from './components/Dashboard';
import DashboardIndex from './components/Dashboard/DashboardIndexRoute';
import LoginOverlayPage from './components/Auth/LoginOverlayPage';
import SignupOverlayPage from './components/Auth/SignupOverlayPage';
import AccountDetails from './components/AccountDetails/AccountDetails';
import LoanStatus from './components/LoanStatus/LoanStatus';
import Transaction from './components/Transaction/Transaction';
import DepositMoney from './components/DepositMoney/DepositMoney';

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
            {/* Default dashboard overview */}
            <Route index element={<DashboardIndex />} />

            {/* Nested dashboard pages */}
            <Route path="account-details" element={<AccountDetails />} />
            <Route path="loan-status" element={<LoanStatus />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="deposit-money" element={<DepositMoney />} />
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
