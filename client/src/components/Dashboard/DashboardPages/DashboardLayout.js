import React from 'react';
import './styles/DashboardLayout.css';
import { FaMoneyBillWave, FaExchangeAlt, FaEuroSign, FaFileInvoiceDollar, FaListUl, FaPiggyBank } from 'react-icons/fa';

const currency = (n) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

const DashboardLayout = ({ accountNumber, currentBalance, transactions }) => {
    return (
        <>
            {/* Widgets row: account overview + quick actions */}
            <section className="dashboard-widgets">
                {/* Account Overview */}
                <div className="card account-overview">
                    <h3 className="card-title">Your Account Overview</h3>
                    <div className="account-meta">
                        <div className="meta-label">Account Number:</div>
                        <div className="meta-value">{accountNumber}</div>
                    </div>
                    <div className="account-meta">
                        <div className="meta-label">Current Balance:</div>
                        <div className="balance-value">{currency(currentBalance)}</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <div className="action-card">
                        <div className="action-icon"><FaMoneyBillWave /></div>
                        <div className="action-label">Deposit Money</div>
                    </div>
                    <div className="action-card">
                        <div className="action-icon"><FaExchangeAlt /></div>
                        <div className="action-label">Transfer Money</div>
                    </div>
                    <div className="action-card">
                        <div className="action-icon"><FaEuroSign /></div>
                        <div className="action-label">Pay Bills</div>
                    </div>
                    <div className="action-card">
                        <div className="action-icon"><FaFileInvoiceDollar /></div>
                        <div className="action-label">Pay Bills</div>
                    </div>
                    <div className="action-card">
                        <div className="action-icon"><FaListUl /></div>
                        <div className="action-label">View Transactions</div>
                    </div>
                    <div className="action-card">
                        <div className="action-icon"><FaPiggyBank /></div>
                        <div className="action-label">Request Loan</div>
                    </div>
                </div>
            </section>

            {/* Recent Transactions */}
            <section className="dashboard-section">
                <div className="card recent-transactions">
                    <h3 className="card-title">Recent Transactions</h3>
                    <div className="transactions-list">
                        {transactions.map((t) => (
                            <div key={t.id} className="transaction-row">
                                <div className="tx-date">{t.date}</div>
                                <div className="tx-desc">{t.description}</div>
                                <div className={`tx-amount ${t.amount < 0 ? 'debit' : 'credit'}`}>
                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default DashboardLayout;
