import React from "react";
import "./styles/HistoryLoans.css";

const historyLoans = [
    { id: 1, name: "Devika Rao", amount: 300000, date: "Oct 4, 2025", status: "COMPLETED" },
    { id: 2, name: "Kiran Patel", amount: 150000, date: "Jul 22, 2025", status: "REJECTED" },
];

const HistoryLoans = () => {
    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">Loan History</h1>
                <p className="admin-page-subtitle">Archive of processed loan applications.</p>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Applicant Name</th>
                            <th>Loan Amount</th>
                            <th>Date Processed</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyLoans.map((l) => (
                            <tr key={l.id}>
                                <td>
                                    <div className="user-name">{l.name}</div>
                                </td>
                                <td>
                                    <div className="amount-text">₹{l.amount.toLocaleString()}</div>
                                </td>
                                <td>
                                    <div className="date-text">{l.date}</div>
                                </td>
                                <td>
                                    <span className={`status-badge ${l.status === 'COMPLETED' ? 'status-completed' : 'status-failed'}`}>
                                        {l.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryLoans;