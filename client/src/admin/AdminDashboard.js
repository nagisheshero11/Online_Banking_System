import React, { useEffect, useState } from "react";
import "./styles/AdminDashboard.css";
import { getPendingApplications } from "./services/adminCardAPI";
import { getLoanStats } from "./services/adminLoanAPI";
import { getBankFunds } from "./services/bankFundAPI";

const AdminDashboard = () => {
    const [summary, setSummary] = useState({
        pendingCards: 0,
        loanStats: {
            totalApplied: 0,
            pending: 0,
            active: 0,
            rejected: 0,
            completed: 0
        },
        bankFunds: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [cards, loanStats, funds] = await Promise.all([
                getPendingApplications(),
                getLoanStats(),
                getBankFunds()
            ]);

            setSummary({
                pendingCards: (cards || []).length,
                loanStats: loanStats || { totalApplied: 0, pending: 0, active: 0, rejected: 0, completed: 0 },
                bankFunds: funds.totalBalance || 0,
            });
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-summary-boxes">

                <div className="summary-box yellow">
                    <h2>Pending Card Requests</h2>
                    <p>{loading ? "..." : summary.pendingCards}</p>
                </div>

                <div className="summary-box blue">
                    <h2>Loan Statistics</h2>
                    {loading ? "..." : (
                        <div style={{ fontSize: '0.9rem', textAlign: 'left', marginTop: '10px' }}>
                            <div>Total Applied: <strong>{summary.loanStats.totalApplied}</strong></div>
                            <div>Pending: <strong>{summary.loanStats.pending}</strong></div>
                            <div>Active: <strong>{summary.loanStats.active}</strong></div>
                            <div>Rejected: <strong>{summary.loanStats.rejected}</strong></div>
                            <div>Completed: <strong>{summary.loanStats.completed}</strong></div>
                        </div>
                    )}
                </div>

                <div className="summary-box green">
                    <h2>Current Bank Funds</h2>
                    <p>{loading ? "..." : `₹${summary.bankFunds.toLocaleString('en-IN')}`}</p>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;