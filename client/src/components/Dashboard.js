import React from 'react';
import Sidebar from './Dashboard/DashboardPages/Sidebar';
import DashboardHeader from './Dashboard/DashboardPages/DashboardHeader';
import DashboardLayout from './Dashboard/DashboardPages/DashboardLayout';
import './Dashboard/DashboardPages/styles/DashboardLayout.css';
// Import theme variables so Dashboard can render standalone
import './styles/LandingPage.css';

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <Sidebar />
            </aside>

            <main className="dashboard-main">
                <DashboardHeader userName="Sravan" />

                <DashboardLayout
                    accountNumber="********1234"
                    currentBalance={7450.8}
                    transactions={[
                        { id: 1, date: '2024-10-26', description: 'Coffee Shop', amount: -2100.0 },
                        { id: 2, date: '2024-10-24', description: 'Salary Deposit', amount: 85.0 },
                    ]}
                />
            </main>
        </div>
    );
};

export default Dashboard;

