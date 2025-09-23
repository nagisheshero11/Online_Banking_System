import React from 'react';
import './styles/DashboardHeader.css';

const DashboardHeader = ({ userName }) => {
    return (
        <header className="dashboard-header">
            <h1 className="dashboard-title">Welcome back, {userName}!</h1>
        </header>
    );
};

export default DashboardHeader;
