import React from "react";
import "./styles/HistoryLoans.css";

const historyLoans = [
    { id: 1, name: "Devika Rao", amount: 300000, date: "Oct 4, 2025" },
    { id: 2, name: "Kiran Patel", amount: 150000, date: "Jul 22, 2025" },
];

const HistoryLoans = () => {
    return (
        <div className="history-loans">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {historyLoans.map((l) => (
                        <tr key={l.id}>
                            <td>{l.name}</td>
                            <td>₹{l.amount.toLocaleString()}</td>
                            <td>{l.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default HistoryLoans;