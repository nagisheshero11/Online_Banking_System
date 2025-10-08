import React from 'react';
import { useLocation } from 'react-router-dom';
import './styles/DashboardHeader.css';

const DashboardHeader = () => {
    const location = useLocation();

    // Map routes to page titles
    const getPageTitle = (pathname) => {
        const routeTitleMap = {
            '/dashboard': 'Dashboard',
            '/dashboard/account-details': 'Account Details',
            '/dashboard/transactions': 'Transactions',
            '/dashboard/deposit-money': 'Deposit Money',
            '/dashboard/transfer-money': 'Transfer Money',
            '/dashboard/request-loan': 'Request Loan',
            '/dashboard/loan-status': 'Loan Status',
            '/dashboard/pay-bills': 'Pay Bills',
            '/dashboard/profile': 'Profile',
            '/dashboard/cards': 'Cards',
            '/dashboard/apply-card': 'Apply Card'
        };

        return routeTitleMap[pathname] || 'Dashboard';
    };

    return (
        <header className="dashboard-header" aria-label="Page header">
            <h1 className="dashboard-title">{getPageTitle(location.pathname)}</h1>
        </header>
    );
};

export default DashboardHeader;
