import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/Dashboard';
import DashboardIndex from './components/Dashboard/DashboardIndexRoute';
import LoginOverlayPage from './components/Auth/LoginOverlayPage';
import SignupOverlayPage from './components/Auth/SignupOverlayPage';
import AccountDetails from './components/AccountDetails/AccountDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />}>
            {/* Nested dashboard routes keep the sidebar/header from Dashboard */}
            <Route index element={<DashboardIndex />} />
            <Route path="account-details" element={<AccountDetails />} />
          </Route>
          {/* legacy top-level account-details removed in favor of dashboard nested route */}
          <Route path="/login" element={<LoginOverlayPage />} />
          <Route path="/signup" element={<SignupOverlayPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;