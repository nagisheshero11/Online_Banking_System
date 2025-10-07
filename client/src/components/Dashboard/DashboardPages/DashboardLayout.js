import React from 'react';
import './styles/DashboardLayout.css';
import { FaMoneyBillWave, FaExchangeAlt, FaRupeeSign, FaPiggyBank } from 'react-icons/fa';

const currency = (n) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'INR' });

const DashboardLayout = ({ accountNumber, currentBalance, transactions }) => {
    return (
        <>
            {/* Summary cards row */}
            <section className="summary-row">
                <div className="summary-card gradient-blue">
                    <div className="summary-title">Account Balance</div>
                    <div className="summary-value">{currency(currentBalance)}</div>
                    <div className="summary-sub">{accountNumber}</div>
                </div>
                <div className="summary-card gradient-green">
                    <div className="summary-title">Total Deposits</div>
                    <div className="summary-value">₹15,000</div>
                    <div className="summary-sub">2 transactions</div>
                </div>
                <div className="summary-card gradient-cyan">
                    <div className="summary-title">Total Spending</div>
                    <div className="summary-value">₹4,350</div>
                    <div className="summary-sub">3 transactions</div>
                </div>
            </section>

            {/* Quick Actions large buttons row */}
            <section className="quick-actions-row card">
                <div className="qa-title">Quick Actions</div>
                <div className="qa-buttons">
                    <button className="qa-btn qa-deposit"><FaMoneyBillWave /> <span>Deposit Money</span></button>
                    <button className="qa-btn qa-transfer"><FaExchangeAlt /> <span>Transfer Money</span></button>
                    <button className="qa-btn qa-bills"><FaRupeeSign /> <span>Pay Bills</span></button>
                    <button className="qa-btn qa-loan"><FaPiggyBank /> <span>Request Loan</span></button>
                </div>
            </section>

            {/* Recent Transactions list */}
            <section className="dashboard-section">
                <div className="card recent-transactions">
                    <div className="rt-header">
                        <h3 className="card-title">Recent Transactions</h3>
                        <a className="view-all" href="#">View All</a>
                    </div>
                    <div className="transactions-list">
                        {transactions.map((t) => (
                            <div key={t.id} className="transaction-row">
                                <div className={`tx-icon ${t.amount < 0 ? 'out' : 'in'}`} aria-hidden></div>
                                <div className="tx-main">
                                    <div className="tx-desc">{t.description}</div>
                                    <div className="tx-sub">{t.date}</div>
                                </div>
                                <div className={`tx-amount ${t.amount < 0 ? 'debit' : 'credit'}`}>
                                    {t.amount < 0 ? '-' : '+'}{currency(Math.abs(t.amount))}
                                </div>
                                <div className="tx-type">{t.amount < 0 ? 'Expense' : 'Deposit'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default DashboardLayout;
