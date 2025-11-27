import React, { useEffect, useState } from "react";
import { getCardHistory } from "./services/adminCardAPI";
import "./styles/HistoryCards.css";

const HistoryCards = () => {
    const [historyCards, setHistoryCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getCardHistory();
            setHistoryCards(data);
        } catch (err) {
            console.error("Failed to fetch card history", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">Card History</h1>
                <p className="admin-page-subtitle">Archive of issued debit and credit cards.</p>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading history...</div>
                ) : historyCards.length === 0 ? (
                    <div className="empty-state">No card history found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Card Holder</th>
                                <th>Card Type</th>
                                <th>Card Number</th>
                                <th>Processed On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyCards.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="user-name">{c.cardHolder}</div>
                                    </td>
                                    <td>
                                        <div className="card-type-text">{c.cardType}</div>
                                    </td>
                                    <td>
                                        <div className="date-text">{c.cardNumber}</div>
                                    </td>
                                    <td>
                                        <div className="date-text">
                                            {c.updatedAt ? new Date(c.updatedAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${c.status === 'ACTIVE' ? 'status-active' : 'status-failed'}`}>
                                            {c.status}
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

export default HistoryCards;