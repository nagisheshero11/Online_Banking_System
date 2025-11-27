import React, { useEffect, useState } from "react";
import { getLoanHistory } from "./services/adminLoanAPI";
import "./styles/HistoryLoans.css";

const HistoryLoans = () => {
    const [historyLoans, setHistoryLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getLoanHistory();
            setHistoryLoans(data);
        } catch (err) {
            console.error("Failed to fetch loan history", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">Loan History</h1>
                <p className="admin-page-subtitle">Archive of processed loan applications.</p>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading history...</div>
                ) : historyLoans.length === 0 ? (
                    <div className="empty-state">No loan history found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Applicant Name</th>
                                <th>Loan Amount</th>
                                <th>Processed On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoans.map((l) => (
                                <tr key={l.id}>
                                    <td>
                                        <div className="user-name">{l.fullName || l.username}</div>
                                    </td>
                                    <td>
                                        <div className="amount-text">₹{Number(l.loanAmount).toLocaleString()}</div>
                                    </td>
                                    <td>
                                        <div className="date-text">
                                            {l.updatedAt ? new Date(l.updatedAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${l.status === 'COMPLETED' || l.status === 'APPROVED' ? 'status-completed' : 'status-failed'}`}>
                                            {l.status}
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

export default HistoryLoans;