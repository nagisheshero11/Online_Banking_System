import React from "react";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
    const summary = {
        pendingCards: 4,
        pendingLoans: 2,
        bankFunds: 1788000,
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="admin-summary-boxes">

                <div className="summary-box yellow">
                    <h2>Pending Card Requests</h2>
                    <p>{summary.pendingCards}</p>
                </div>

                <div className="summary-box blue">
                    <h2>Pending Loans</h2>
                    <p>{summary.pendingLoans}</p>
                </div>

                <div className="summary-box green">
                    <h2>Current Bank Funds</h2>
                    <p>₹{summary.bankFunds.toLocaleString()}</p>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;