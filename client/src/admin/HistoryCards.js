import React from "react";
import "./styles/HistoryCards.css";

const historyCards = [
    { id: 1, holder: "Sravan Kumar", type: "Debit Card", issued: "Aug 12, 2025", status: "ACTIVE" },
    { id: 2, holder: "Rahul Verma", type: "Credit Card", issued: "Sep 3, 2025", status: "ACTIVE" },
];

const HistoryCards = () => {
    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">Card History</h1>
                <p className="admin-page-subtitle">Archive of issued debit and credit cards.</p>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Card Holder</th>
                            <th>Card Type</th>
                            <th>Issued On</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyCards.map((c) => (
                            <tr key={c.id}>
                                <td>
                                    <div className="user-name">{c.holder}</div>
                                </td>
                                <td>
                                    <div className="card-type-text">{c.type}</div>
                                </td>
                                <td>
                                    <div className="date-text">{c.issued}</div>
                                </td>
                                <td>
                                    <span className="status-badge status-active">
                                        {c.status}
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

export default HistoryCards;