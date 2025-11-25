import React, { useEffect, useState } from "react";
import { getAllTransactions } from "./services/adminTransactionAPI";
import "./styles/BankFunds.css"; // Reuse existing styles
import { FaExchangeAlt, FaArrowRight } from "react-icons/fa";

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getAllTransactions();
            setTransactions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => n?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    return (
        <div className="bank-funds">
            <div className="header-row" style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    User Transactions
                </h1>
                <p style={{ color: '#64748B', marginTop: '4px' }}>View all user transactions.</p>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">No transactions found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td style={{ color: '#64748B', fontSize: '0.85rem' }}>
                                        {formatDate(tx.createdAt)}
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#334155' }}>
                                        {tx.transactionId}
                                    </td>
                                    <td style={{ fontWeight: '600', color: '#0F172A' }}>
                                        {tx.fromAccountNumber}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                                            <FaArrowRight style={{ fontSize: '0.7rem' }} />
                                            <span style={{ fontWeight: '600', color: '#0F172A' }}>{tx.toAccountNumber}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: '700', color: '#0F172A' }}>
                                        {currency(tx.amount)}
                                    </td>
                                    <td>
                                        <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'}`}
                                            style={{
                                                background: tx.status === 'COMPLETED' ? '#ECFDF5' : '#FEF2F2',
                                                color: tx.status === 'COMPLETED' ? '#10B981' : '#EF4444',
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700'
                                            }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminTransactions;
