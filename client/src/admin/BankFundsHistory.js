import React, { useEffect, useState } from "react";
import { getBankFundHistory } from "./services/bankFundAPI";
import "./styles/BankFunds.css"; // Reuse existing styles
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BankFundsHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getBankFundHistory();
            setHistory(data);
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
        doc.text("Bank Funds Transaction History", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        const tableColumn = ["Date", "Description", "Type", "Amount", "Balance After"];
        const tableRows = [];

        history.forEach(tx => {
            const txData = [
                formatDate(tx.timestamp),
                tx.description,
                tx.transactionType,
                // Replace symbol with Rs. for PDF compatibility
                currency(tx.amount).replace('₹', 'Rs. '),
                currency(tx.balanceAfter).replace('₹', 'Rs. ')
            ];
            tableRows.push(txData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            columnStyles: {
                3: { halign: 'right' }, // Amount
                4: { halign: 'right' }  // Balance After
            },
            headStyles: { fillColor: [15, 23, 42] } // Match admin theme
        });

        doc.save("bank_funds_history.pdf");
    };

    return (
        <div className="bank-funds">
            <div className="header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} className="back-btn" style={{
                        background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.2rem'
                    }}>
                        <FaArrowLeft />
                    </button>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                        Bank Transactions
                    </h1>
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
                    <div className="loading-state">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="empty-state">No transactions found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Balance After</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((tx) => (
                                <tr key={tx.id}>
                                    <td style={{ color: '#64748B', fontSize: '0.9rem' }}>
                                        {formatDate(tx.timestamp)}
                                    </td>
                                    <td style={{ fontWeight: '500', color: '#334155' }}>
                                        {tx.description}
                                    </td>
                                    <td>
                                        <span className={`badge ${tx.transactionType === 'CREDIT' ? 'badge-success' : 'badge-danger'}`}
                                            style={{
                                                background: tx.transactionType === 'CREDIT' ? '#ECFDF5' : '#FEF2F2',
                                                color: tx.transactionType === 'CREDIT' ? '#10B981' : '#EF4444',
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700'
                                            }}>
                                            {tx.transactionType}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: '600', color: tx.transactionType === 'CREDIT' ? '#10B981' : '#EF4444' }}>
                                        {tx.transactionType === 'CREDIT' ? '+' : '-'}{currency(tx.amount)}
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', color: '#0F172A' }}>
                                        {currency(tx.balanceAfter)}
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

export default BankFundsHistory;
