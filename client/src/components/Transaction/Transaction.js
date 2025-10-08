import React, { useState } from "react";
import "./styles/Transaction.css";

const Transactions = () => {
  const [filter, setFilter] = useState("All Transactions");
  const [search, setSearch] = useState("");

  const transactions = [
    { id: "TXN001", date: "2025-07-15 14:30:25", type: "Deposit", description: "Cash Deposit", amount: 5000, status: "Success" },
    { id: "TXN002", date: "2025-07-14 10:15:00", type: "Transfer", description: "Transfer to BANK10012346", amount: -2000, status: "Success" },
    { id: "TXN003", date: "2025-07-13 16:45:30", type: "Bill Payment", description: "Electricity Bill Payment", amount: -850, status: "Success" },
    { id: "TXN004", date: "2025-07-12 09:20:15", type: "Deposit", description: "Salary Credit", amount: 10000, status: "Success" },
    { id: "TXN005", date: "2025-07-11 18:30:00", type: "Transfer", description: "Transfer to BANK10012347", amount: -1500, status: "Success" },
  ];

  const filteredTransactions = transactions.filter(
    (txn) =>
      (filter === "All Transactions" || txn.type === filter) &&
      (txn.id.toLowerCase().includes(search.toLowerCase()) ||
        txn.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div>
          <h2>Transaction History</h2>
          <p>View all your past transactions</p>
        </div>
        <button className="download-btn">⬇ Download Statement</button>
      </div>

      <div className="transactions-filters">
        <input
          type="text"
          placeholder="Search by transaction ID or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All Transactions</option>
          <option>Deposit</option>
          <option>Transfer</option>
          <option>Bill Payment</option>
        </select>
      </div>

      <div className="transactions-table">
        <h4>{filteredTransactions.length} Transactions Found</h4>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>{txn.date}</td>
                <td>
                  <span className={`txn-type ${txn.type.replace(" ", "-").toLowerCase()}`}>
                    {txn.type}
                  </span>
                </td>
                <td>{txn.description}</td>
                <td className={`amount ${txn.amount > 0 ? "credit" : "debit"}`}>
                  {txn.amount > 0 ? `+₹${txn.amount}` : `₹${Math.abs(txn.amount)}`}
                </td>
                <td>
                  <span className="status success">{txn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
