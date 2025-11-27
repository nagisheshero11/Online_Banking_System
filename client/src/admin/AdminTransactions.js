import React, { useEffect, useState } from "react";
import { getAllTransactions } from "./services/adminTransactionAPI";
import "./styles/AdminTransactions.css";
import { FaArrowRight } from "react-icons/fa";

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
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">User Transactions</h1>
                <p className="admin-page-subtitle">View and monitor all user transaction history.</p>
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
                                <th>From Account</th>
                                <th>To Account</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div className="date-text">{formatDate(tx.createdAt)}</div>
                                    </td>
                                    <td>
                                        <div className="tx-id-text">{tx.transactionId}</div>
                                    </td>
                                    <td>
                                        <div className="account-text">{tx.fromAccountNumber}</div>
                                    </td>
                                    <td>
                                        <div className="transfer-arrow">
                                            <FaArrowRight />
                                            <span className="account-text">{tx.toAccountNumber}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="amount-text">{currency(tx.amount)}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${tx.status === 'COMPLETED' ? 'status-completed' : 'status-failed'}`}>
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
