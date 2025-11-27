import React, { useState, useEffect } from "react";
import { getUserMonthlyAnalytics } from "../../services/analyticsAPI";
import { FaChartLine, FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./styles/Analytics.css";
import { useToast } from '../../context/ToastContext';

const Analytics = () => {
    const { showToast } = useToast();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch analytics
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getUserMonthlyAnalytics();
                setAnalytics(data);
            } catch (error) {
                console.error("❌ Error fetching analytics:", error);
                showToast(error.message || "Failed to load analytics", 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="analytics-loading">Loading analytics...</div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="analytics-container">
                <div className="analytics-error">Failed to load analytics data.</div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-page-header">
                <div>
                    <h1 className="analytics-page-title">Analytics</h1>
                    <p className="analytics-page-subtitle">
                        Your financial insights for {analytics.month} {analytics.year}
                    </p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="analytics-section">
                <div className="analytics-header">
                    <FaChartLine className="analytics-icon" />
                    <h3>Monthly Overview</h3>
                </div>

                {/* Summary Cards */}
                <div className="analytics-summary">
                    <div className="summary-card credit">
                        <div className="summary-icon"><FaArrowDown /></div>
                        <div className="summary-content">
                            <span className="summary-label">Total Credits</span>
                            <span className="summary-value">₹{Number(analytics.totalCredits).toLocaleString()}</span>
                            <span className="summary-count">{analytics.creditCount} transactions</span>
                        </div>
                    </div>
                    <div className="summary-card debit">
                        <div className="summary-icon"><FaArrowUp /></div>
                        <div className="summary-content">
                            <span className="summary-label">Total Debits</span>
                            <span className="summary-value">₹{Number(analytics.totalDebits).toLocaleString()}</span>
                            <span className="summary-count">{analytics.debitCount} transactions</span>
                        </div>
                    </div>
                    <div className="summary-card total">
                        <div className="summary-icon"><FaExchangeAlt /></div>
                        <div className="summary-content">
                            <span className="summary-label">Total Transactions</span>
                            <span className="summary-value">{analytics.totalTransactions}</span>
                            <span className="summary-count">This month</span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="analytics-charts">
                    {/* Debit vs Credit Comparison */}
                    <div className="chart-card">
                        <h4>Debit vs Credit Comparison</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={[
                                { name: 'Debits', amount: Number(analytics.totalDebits), fill: '#EF4444' },
                                { name: 'Credits', amount: Number(analytics.totalCredits), fill: '#10B981' }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" />
                                <YAxis stroke="#64748B" />
                                <Tooltip
                                    contentStyle={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                />
                                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                    {[
                                        { name: 'Debits', amount: Number(analytics.totalDebits), fill: '#EF4444' },
                                        { name: 'Credits', amount: Number(analytics.totalCredits), fill: '#10B981' }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Daily Transaction Trend */}
                    <div className="chart-card wide">
                        <h4>Daily Transaction Trend</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.dailyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="day" stroke="#64748B" />
                                <YAxis stroke="#64748B" />
                                <Tooltip
                                    contentStyle={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="debits" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="Debits" />
                                <Line type="monotone" dataKey="credits" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Credits" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Transaction Type Distribution */}
                    <div className="chart-card">
                        <h4>Transaction Distribution</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Debits', value: analytics.debitCount, fill: '#EF4444' },
                                        { name: 'Credits', value: analytics.creditCount, fill: '#10B981' }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {[
                                        { name: 'Debits', value: analytics.debitCount, fill: '#EF4444' },
                                        { name: 'Credits', value: analytics.creditCount, fill: '#10B981' }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
