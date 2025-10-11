import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Sidebar from './Dashboard/Sidebar';
import DashboardHeader from './Dashboard/DashboardHeader';
import DashboardNavbar from './Dashboard/DashboardNavbar';
import './Dashboard/styles/DashboardLayout.css';
// Import theme variables so Dashboard can render standalone
import './styles/LandingPage.css';
import Toast from './Common/Toast';

const Dashboard = () => {
    // Shared mock data for the dashboard pages. In a real app this would come from API/context.
    const shared = {
        accountNumber: '********1234',
        currentBalance: 7450.8,
        transactions: [
            { id: 1, date: '2024-10-26', description: 'Coffee Shop', amount: -2100.0 },
            { id: 2, date: '2024-10-24', description: 'Salary Deposit', amount: 85.0 },
        ],
    };

    const location = useLocation();
    const [showLoginToast, setShowLoginToast] = useState(false);

    useEffect(() => {
        if (location.state && location.state.showLoginSuccess) {
            setShowLoginToast(true);
            // Clear the flag so back/forward doesn't retrigger
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <>
            <DashboardNavbar userName="Sravan Kumar" accountId="BANK10012345" />
            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <Sidebar />
                </aside>

                <main className="dashboard-main">
                    {showLoginToast && (
                        <Toast
                            message="Login successful"
                            duration={2500}
                            variant="success"
                            onClose={() => setShowLoginToast(false)}
                        />
                    )}
                    <DashboardHeader />

                    {/* Render nested routes here and provide shared data via outlet context */}
                    <Outlet context={shared} />
                </main>
            </div>
        </>
    );
};

export default Dashboard;

