import React, { useEffect, useState } from "react";
import "./styles/AdminDashboard.css";
import { getPendingApplications } from "./services/adminCardAPI";
import { getLoanStats } from "./services/adminLoanAPI";
import { getBankFunds } from "./services/bankFundAPI";
import { getAdminDashboardAnalytics } from "./services/adminAnalyticsAPI";
import { FaCreditCard, FaHandHoldingUsd, FaMoneyBillWave, FaChartPie, FaExclamationCircle, FaUsers, FaExchangeAlt } from "react-icons/fa";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchAnalytics();
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

    const fetchAnalytics = async () => {
        try {
            const data = await getAdminDashboardAnalytics();
            setAnalytics(data);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        } finally {
            setAnalyticsLoading(false);
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

            {/* Analytics Section */}
            {!analyticsLoading && analytics && (
                <div className="admin-analytics-section">
                    <h2 className="analytics-title">System Analytics</h2>

                    {/* Analytics Summary Cards */}
                    <div className="analytics-summary-grid">
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <FaUsers className="analytics-icon users" />
                                <span>Total Users</span>
                            </div>
                            <div className="analytics-card-value">{analytics.totalUsers}</div>
                        </div>
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <FaExchangeAlt className="analytics-icon transactions" />
                                <span>Total Transactions</span>
                            </div>
                            <div className="analytics-card-value">{analytics.totalTransactions}</div>
                        </div>
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <FaMoneyBillWave className="analytics-icon revenue" />
                                <span>Card Revenue</span>
                            </div>
                            <div className="analytics-card-value">₹{Number(analytics.estimatedCardRevenue).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="admin-charts-grid">
                        {/* User Growth Chart */}
                        <div className="admin-chart-card">
                            <h3>User Growth (Last 30 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analytics.userGrowth}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748B" />
                                    <Tooltip
                                        contentStyle={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Transaction Volume Chart */}
                        <div className="admin-chart-card">
                            <h3>Transaction Volume (Last 30 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.transactionVolume}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748B" />
                                    <Tooltip
                                        contentStyle={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Transaction Type Breakdown */}
                        <div className="admin-chart-card">
                            <h3>Transaction Type Breakdown</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(analytics.transactionTypeBreakdown).map(([name, value]) => ({ name, value }))}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {Object.entries(analytics.transactionTypeBreakdown).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Card Statistics */}
                        <div className="admin-chart-card">
                            <h3>Card Statistics</h3>
                            <div className="card-stats-display">
                                <div className="card-stat-item">
                                    <span className="card-stat-label">Total Cards</span>
                                    <span className="card-stat-value">{analytics.cardStats.total}</span>
                                </div>
                                <div className="card-stat-item">
                                    <span className="card-stat-label">Active</span>
                                    <span className="card-stat-value success">{analytics.cardStats.active}</span>
                                </div>
                                <div className="card-stat-item">
                                    <span className="card-stat-label">Pending</span>
                                    <span className="card-stat-value warning">{analytics.cardStats.pending}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;