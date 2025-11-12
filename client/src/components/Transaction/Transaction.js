// client/src/pages/Transactions.jsx

import React, { useState, useEffect } from "react";
import { getAllTransactions } from "../../services/transactionAPI";
import "./styles/Transaction.css";

const Transactions = () => {
  const [filter, setFilter] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch real transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        // Sort newest first
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sorted);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        alert(error.message || "Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // ✅ Handle loading and empty state
  if (loading)
    return (
      <div className="transactions-container">
        <p className="loading-text">Loading transactions...</p>
      </div>
    );

  if (!transactions.length)
    return (
      <div className="transactions-container">
        <h2>Transaction History</h2>
        <p>No transactions found.</p>
      </div>
    );

  // ✅ Map transaction type (optional logic)
  const getTransactionType = (txn) => {
    if (txn.fromAccountNumber === txn.toAccountNumber) return "Internal";
    if (txn.fromAccountNumber && txn.toAccountNumber) return "Transfer";
    return "Other";
  };

  // ✅ Filter & search logic
  const filteredTransactions = transactions.filter((txn) => {
    const type = getTransactionType(txn);
    return (
      (filter === "All Transactions" || filter === type) &&
      (txn.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
        (txn.remarks || "").toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="transactions-container">
      {/* Header */}
      <div className="transactions-header">
        <div>
          <h2>Transaction History</h2>
          <p>View all your past transactions</p>
        </div>
        <button className="download-btn" onClick={() => window.print()}>
          ⬇ Download Statement
        </button>
      </div>

      {/* Filters */}
      <div className="transactions-filters">
        <input
          type="text"
          placeholder="Search by transaction ID or remarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All Transactions</option>
          <option>Transfer</option>
          <option>Deposit</option>
          <option>Received</option>
        </select>
      </div>

      {/* Table */}
      <div className="transactions-table">
        <h4>{filteredTransactions.length} Transactions Found</h4>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.transactionId}>
                <td>{txn.transactionId}</td>
                <td>{new Date(txn.createdAt).toLocaleString()}</td>
                <td>{txn.fromAccountNumber}</td>
                <td>{txn.toAccountNumber}</td>

                {/* Amount color logic */}
                <td
                  className={`amount ${
                    txn.status === "FAILED"
                      ? "failed"
                      : txn.fromAccountNumber === txn.toAccountNumber
                      ? "neutral"
                      : txn.fromAccountNumber
                      ? "debit"
                      : "credit"
                  }`}
                >
                  ₹{txn.amount?.toLocaleString()}
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`status ${
                      txn.status === "COMPLETED" ? "success" : "failed"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>

                <td>{txn.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
