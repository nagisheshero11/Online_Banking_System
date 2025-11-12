// client/src/pages/Transactions.jsx

import React, { useState, useEffect } from "react";
import { getAllTransactions } from "../../services/transactionAPI";
import { getAccountDetails } from "../../services/accountAPI";
import "./styles/Transaction.css";

const Transactions = () => {
  const [filter, setFilter] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAccountNumber, setUserAccountNumber] = useState("");

  // ✅ Fetch account number & transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getAccountDetails();
        setUserAccountNumber(user.accountNumber);

        const data = await getAllTransactions();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sorted);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        alert(error.message || "Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // ✅ Determine Transaction Type (Debited / Credited / Other)
  const getTransactionType = (txn) => {
    if (!userAccountNumber) return "Transfer";

    if (txn.fromAccountNumber === userAccountNumber) return "Debited";
    if (txn.toAccountNumber === userAccountNumber) return "Credited";
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
          placeholder="Search by transaction ID or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All Transactions</option>
          <option>Credited</option>
          <option>Debited</option>
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
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => {
              const type = getTransactionType(txn);
              const isDebit = type === "Debited";
              const isCredit = type === "Credited";

              return (
                <tr key={txn.transactionId}>
                  <td>{txn.transactionId}</td>
                  <td>{new Date(txn.createdAt).toLocaleString()}</td>
                  <td>
                    <span
                      className={`txn-type ${
                        type.toLowerCase()
                      }`}
                    >
                      {type}
                    </span>
                  </td>
                  <td>{txn.fromAccountNumber}</td>
                  <td>{txn.toAccountNumber}</td>

                  <td
                    className={`amount ${
                      isDebit ? "debit" : isCredit ? "credit" : ""
                    }`}
                  >
                    {isCredit
                      ? `+₹${txn.amount.toLocaleString()}`
                      : `-₹${txn.amount.toLocaleString()}`}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        txn.status === "COMPLETED" ||
                        txn.status === "Success"
                          ? "success"
                          : "failed"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>

                  <td>{txn.remarks || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
