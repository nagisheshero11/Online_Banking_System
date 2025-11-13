// client/src/pages/Transactions.jsx

import React, { useState, useEffect } from "react";
import { getAllTransactions } from "../../services/transactionAPI";
import { getAccountDetails } from "../../services/accountAPI";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./styles/Transaction.css";

const Transactions = () => {
  const [filter, setFilter] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAccount, setUserAccount] = useState(null);

  // ✅ Fetch account and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getAccountDetails();
        setUserAccount(user);

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

  // ✅ Determine Transaction Type (Debited / Credited)
  const getTransactionType = (txn) => {
    if (!userAccount) return "Transfer";
    if (txn.fromAccountNumber === userAccount.accountNumber) return "Debited";
    if (txn.toAccountNumber === userAccount.accountNumber) return "Credited";
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

const handleDownloadPDF = async () => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // === COLORS ===
  const pixelGreen = [53, 199, 89];
  const mint = [230, 255, 230];
  const teal = [0, 59, 70];
  const gray = [85, 85, 85];
  const black = [13, 13, 13];
  const red = [220, 38, 38];
  const green = [26, 150, 65];

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });

  // Helper to format numbers properly
  const formatCurrency = (value) => {
    const n = Number(value || 0);
    const parts = Math.abs(n).toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  try {
    const logo = await loadImage(`${process.env.PUBLIC_URL}/logo-money.png`);

    // === HEADER ===
    doc.addImage(logo, "PNG", 50, 40, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...teal);
    doc.text("BANKIFY", 120, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...gray);
    doc.text("Your Smart Digital Banking Partner", 120, 80);

    // Divider
    doc.setDrawColor(...teal);
    doc.setLineWidth(2);
    doc.line(50, 100, pageWidth - 50, 100);

    // === ACCOUNT DETAILS ===
    doc.setFontSize(12);
    doc.setTextColor(...black);
    let startY = 125;
    let spacing = 18;

    doc.text(`Account Holder: ${userAccount.firstName} ${userAccount.lastName}`, 50, startY);
    doc.text(`Account No: ${userAccount.accountNumber}`, 50, startY + spacing);
    doc.text(`Statement Date: ${new Date().toLocaleDateString()}`, 50, startY + spacing * 2);
    doc.text(`Period: Last 30 Days`, 50, startY + spacing * 3);

    // === TABLE ===
    autoTable(doc, {
      startY: 240,
      head: [
        [
          { content: "DATE", styles: { halign: "center" } },
          { content: "FROM", styles: { halign: "center" } },
          { content: "TO", styles: { halign: "center" } },
          { content: "AMOUNT (₹)", styles: { halign: "center" } },
          { content: "TYPE", styles: { halign: "center" } },
        ],
      ],
      body: filteredTransactions.map((txn) => {
        const isDebit = txn.fromAccountNumber === userAccount.accountNumber;
        const isCredit = txn.toAccountNumber === userAccount.accountNumber;
        const type = isDebit ? "Debited" : isCredit ? "Credited" : "Other";

        const formatted = formatCurrency(txn.amount);
        const amountString = `${formatted}`; // ← clean number ONLY


        return [
          {
            content: new Date(txn.createdAt).toLocaleString(),
            styles: { halign: "center" },
          },
          { content: txn.fromAccountNumber || "-", styles: { halign: "center" } },
          { content: txn.toAccountNumber || "-", styles: { halign: "center" } },
          {
            content: amountString,
            styles: {
              halign: "center",
              textColor: isCredit ? green : red,
              fontStyle: "bold",
            },
          },

          {
            content: type,
            styles: {
              halign: "center",
              textColor: isCredit ? green : red,
              fontStyle: "bold",
            },
          },
        ];
      }),
      theme: "grid",
      styles: {
        fontSize: 10,
        textColor: black,
        valign: "middle",
        cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
      },
      headStyles: {
        fillColor: pixelGreen,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: mint },
      columnStyles: {
        0: { cellWidth: 130 }, // DATE
        1: { cellWidth: 110 }, // FROM
        2: { cellWidth: 110 }, // TO
        3: { cellWidth: 110, halign: "center" }, // AMOUNT — centered
        4: { cellWidth: 80, halign: "center" }, // TYPE
      },
      margin: { left: 45, right: 45 },
      tableLineColor: teal,
      tableLineWidth: 0.5,
    });

    // === FOOTER ===
    const footerY = pageHeight - 60;
    const squareSize = 10;

    for (let i = 0; i < pageWidth / squareSize; i++) {
      const color = i % 2 === 0 ? teal : mint;
      doc.setFillColor(...color);
      doc.rect(i * squareSize, footerY - 12, squareSize, 12, "F");
    }

    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(
      "© 2025 Bankify Technologies Pvt. Ltd. | support@bankify.io | www.bankify.io",
      pageWidth / 2,
      footerY + 10,
      { align: "center" }
    );

    doc.setFontSize(8);
    doc.text(
      "This is a system-generated statement. No signature required.",
      pageWidth / 2,
      footerY + 25,
      { align: "center" }
    );

    doc.save(`BANKIFY_Statement_${userAccount.accountNumber}.pdf`);
  } catch (error) {
    console.error("❌ Failed to generate PDF:", error);
    alert("Error generating statement. Please check your logo in /public folder.");
  }
};






  return (
    <div className="transactions-container">
      {/* Header */}
      <div className="transactions-header">
        <div>
          <h2>Transaction History</h2>
          <p>View all your past transactions</p>
        </div>
        <button className="download-btn" onClick={handleDownloadPDF}>
          ⬇ Download Statement (PDF)
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
                    <span className={`txn-type ${type.toLowerCase()}`}>
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
