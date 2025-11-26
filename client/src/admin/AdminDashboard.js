import React, { useEffect, useState } from "react";
import "./styles/AdminDashboard.css";
import { getPendingApplications } from "./services/adminCardAPI";
import { getAllLoans } from "./services/adminLoanAPI";
import { getBankFunds } from "./services/bankFundAPI";

const AdminDashboard = () => {
    const [summary, setSummary] = useState({
        pendingCards: 0,
        pendingLoans: 0,
        bankFunds: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [cards, loans, funds] = await Promise.all([
                getPendingApplications(),
                getAllLoans(),
                getBankFunds()
            ]);

            const pendingLoansCount = (loans || []).filter(l => l.status === "PENDING").length;

            setSummary({
                pendingCards: (cards || []).length,
                pendingLoans: pendingLoansCount,
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
                    <h2>Pending Loans</h2>
                    <p>{loading ? "..." : summary.pendingLoans}</p>
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