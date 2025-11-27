import React, { useEffect, useState } from "react";
import { getAllTransactions } from "./services/adminTransactionAPI";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./styles/AdminTransactions.css";
import { FaArrowRight, FaDownload } from "react-icons/fa";

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getAllTransactions();
            setTransactions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => n?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("User Transactions Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        const tableColumn = ["Date", "Tx ID", "From Account", "To Account", "Amount", "Status"];
        const tableRows = [];

        transactions.forEach(tx => {
            const txData = [
                formatDate(tx.createdAt),
                tx.transactionId,
                tx.fromAccountNumber,
                tx.toAccountNumber,
                currency(tx.amount).replace('₹', 'Rs. '),
                tx.status
            ];
            tableRows.push(txData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            columnStyles: {
                4: { halign: 'right' } // Amount
            },
            headStyles: { fillColor: [15, 23, 42] } // Match admin theme
        });

        doc.save("user_transactions_report.pdf");
    };

    return (
        <div className="admin-content-container">
            <div className="admin-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="admin-page-title">User Transactions</h1>
                    <p className="admin-page-subtitle">View and monitor all user transaction history.</p>
                </div>
                <button onClick={downloadPDF} className="download-btn" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px', background: '#0F172A', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                }}>
                    <FaDownload /> Download PDF
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">No transactions found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>From Account</th>
                                <th>To Account</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div className="date-text">{formatDate(tx.createdAt)}</div>
                                    </td>
                                    <td>
                                        <div className="tx-id-text">{tx.transactionId}</div>
                                    </td>
                                    <td>
                                        <div className="account-text">{tx.fromAccountNumber}</div>
                                    </td>
                                    <td>
                                        <div className="transfer-arrow">
                                            <FaArrowRight />
                                            <span className="account-text">{tx.toAccountNumber}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="amount-text">{currency(tx.amount)}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${tx.status === 'COMPLETED' ? 'status-completed' : 'status-failed'}`}>
                                            {tx.status}
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

export default AdminTransactions;
