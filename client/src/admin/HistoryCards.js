import React from "react";
import "./styles/HistoryCards.css";

const historyCards = [
    { id: 1, holder: "Sravan Kumar", type: "Debit Card", issued: "Aug 12, 2025" },
    { id: 2, holder: "Rahul Verma", type: "Credit Card", issued: "Sep 3, 2025" },
];

const HistoryCards = () => {
    return (
        <div className="history-cards">
            <h1>Cards History</h1>

            <table>
                <thead>
                    <tr>
                        <th>Holder</th>
                        <th>Card Type</th>
                        <th>Issued On</th>
                    </tr>
                </thead>
                <tbody>
                    {historyCards.map((c) => (
                        <tr key={c.id}>
                            <td>{c.holder}</td>
                            <td>{c.type}</td>
                            <td>{c.issued}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryCards;