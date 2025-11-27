import React, { useEffect, useState } from "react";
import "./styles/AdminDashboard.css";
import { getPendingApplications } from "./services/adminCardAPI";
import { getLoanStats } from "./services/adminLoanAPI";
import { getBankFunds } from "./services/bankFundAPI";
import { FaCreditCard, FaHandHoldingUsd, FaMoneyBillWave, FaChartPie, FaExclamationCircle } from "react-icons/fa";

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
        <div className="admin-dashboard-container">
            <div className="dashboard-grid">

                {/* Bank Funds Card */}
                <div className="stat-card funds-card">
                    <div className="stat-icon-wrapper green">
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-content">
                        <h3>Total Bank Funds</h3>
                        <div className="stat-value">
                            {loading ? "..." : `₹${summary.bankFunds.toLocaleString('en-IN')}`}
                        </div>
                        <p className="stat-sub">Available Liquidity</p>
                    </div>
                </div>

                {/* Pending Cards Card */}
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper orange">
                            <FaCreditCard />
                        </div>
                        {summary.pendingCards > 0 && (
                            <span className="badge warning">
                                <FaExclamationCircle /> Action Needed
                            </span>
                        )}
                    </div>
                    <div className="stat-content">
                        <h3>Pending Card Requests</h3>
                        <div className="stat-value">
                            {loading ? "..." : summary.pendingCards}
                        </div>
                        <p className="stat-sub">Applications awaiting approval</p>
                    </div>
                </div>

                {/* Loan Stats Card (Wide) */}
                <div className="stat-card wide-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper blue">
                            <FaHandHoldingUsd />
                        </div>
                        <h3>Loan Statistics</h3>
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading stats...</div>
                    ) : (
                        <div className="loan-stats-grid">
                            <div className="loan-stat-item">
                                <span className="label">Total Applied</span>
                                <span className="value">{summary.loanStats.totalApplied}</span>
                            </div>
                            <div className="loan-stat-item">
                                <span className="label">Pending</span>
                                <span className="value warning">{summary.loanStats.pending}</span>
                            </div>
                            <div className="loan-stat-item">
                                <span className="label">Active</span>
                                <span className="value success">{summary.loanStats.active}</span>
                            </div>
                            <div className="loan-stat-item">
                                <span className="label">Rejected</span>
                                <span className="value danger">{summary.loanStats.rejected}</span>
                            </div>
                            <div className="loan-stat-item">
                                <span className="label">Completed</span>
                                <span className="value info">{summary.loanStats.completed}</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;