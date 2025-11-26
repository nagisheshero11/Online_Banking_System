import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaBolt, FaWifi, FaMobileAlt, FaFire, FaCheckCircle, FaUniversity } from "react-icons/fa";
import { getMyBills, payBill, getBillsByLoan } from "../../services/billsAPI";
import "./styles/PayBills.css";

const PayBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingBillId, setPayingBillId] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null); // For modal
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const loanIdParam = searchParams.get("loanId");

    useEffect(() => {
        fetchBills();
    }, [loanIdParam]);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const data = loanIdParam
                ? await getBillsByLoan(loanIdParam)
                : await getMyBills();

            setBills((data || []).map(b => ({
                ...b,
                amount: Number(b.amount),
                dueDate: b.dueDate ? String(b.dueDate) : null,
            })));
        } catch (err) {
            console.error("Bills fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const openPaymentModal = (bill) => {
        setSelectedBill(bill);
    };

    const confirmPayment = async () => {
        if (!selectedBill) return;
        setPayingBillId(selectedBill.id);

        try {
            await payBill(selectedBill.id);
            await fetchBills();
            setSuccessMsg("Bill paid successfully! Transaction recorded.");
            setTimeout(() => setSuccessMsg(null), 3000);
            setSelectedBill(null); // Close modal
        } catch (err) {
            alert(err.message || "Payment failed");
        } finally {
            setPayingBillId(null);
        }
    };

    const handlePayAll = async () => {
        const outstanding = bills.filter(b => b.status === "UNPAID" || b.status === "OVERDUE");
        if (outstanding.length === 0) return;
        if (!window.confirm(`Pay all ${outstanding.length} bills?`)) return;

        for (let b of outstanding) {
            try {
                setPayingBillId(b.id);
                await payBill(b.id);
            } catch (e) {
                console.error(e);
            }
        }
        await fetchBills();
        setPayingBillId(null);
    };

    const totalDue = bills
        .filter(b => b.status === "UNPAID" || b.status === "OVERDUE")
        .reduce((sum, b) => sum + Number(b.amount), 0);

    const currency = (n) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    const getBillIcon = (bill) => {
        if (bill.loanId) return <FaUniversity />;

        const t = (bill.type || "").toLowerCase();
        if (t.includes("electric")) return <FaBolt />;
        if (t.includes("internet") || t.includes("wifi")) return <FaWifi />;
        if (t.includes("mobile") || t.includes("phone")) return <FaMobileAlt />;
        if (t.includes("gas")) return <FaFire />;
        return <FaBolt />; // Default
    };

    return (
        <div className="pay-bills-container">
            {successMsg && (
                <div className="success-toast">
                    <FaCheckCircle /> {successMsg}
                </div>
            )}
            {/* Left: Visual Guide */}
            <div className="bills-visual">
                <div className="visual-bg"></div>

                <div className="visual-content">
                    <div>
                        <div className="visual-title">Manage<br />Obligations</div>
                        <div className="visual-subtitle">Stay on top of your dues with a single tap.</div>
                    </div>

                    <div className="total-due-card">
                        <div className="due-label">Total Outstanding</div>
                        <div className="due-value">{currency(totalDue)}</div>

                        {totalDue > 0 && (
                            <button className="pay-all-btn" onClick={handlePayAll}>
                                Pay All Dues
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Bill List */}
            <div className="bills-list">
                <div className="list-header">
                    <div className="list-title">Your Bills</div>
                </div>

                {loading ? (
                    <div className="empty-state">Loading bills...</div>
                ) : bills.length === 0 ? (
                    <div className="empty-state">No bills found. You're all caught up! 🎉</div>
                ) : (
                    bills.map(bill => (
                        <div key={bill.id} className="bill-card">
                            <div className="bill-icon">
                                {getBillIcon(bill)}
                            </div>

                            <div className="bill-details">
                                <div className="bill-type">
                                    {bill.loanId ? `Loan Payment #${bill.id}` : `Bill #${bill.id}`}
                                </div>
                                <div className="bill-meta">
                                    <span className={`status-pill status-${bill.status.toLowerCase()}`}>
                                        {bill.status}
                                    </span>
                                    {bill.dueDate && <span>Due: {bill.dueDate}</span>}
                                </div>
                            </div>

                            <div className="bill-amount">
                                <div className="amount-text">{currency(bill.amount)}</div>
                            </div>

                            <div className="bill-action">
                                {bill.status === "PAID" ? (
                                    <div style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                        <FaCheckCircle /> Paid
                                    </div>
                                ) : (
                                    <button
                                        className="pay-btn"
                                        onClick={() => openPaymentModal(bill)}
                                        disabled={payingBillId === bill.id}
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Payment Summary Modal */}
            {selectedBill && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Payment Summary</h3>
                        <div className="summary-row">
                            <span>Bill Type:</span>
                            <strong>{selectedBill.billType}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Due Date:</span>
                            <strong>{selectedBill.dueDate}</strong>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount:</span>
                            <strong>{currency(selectedBill.amount)}</strong>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setSelectedBill(null)}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmPayment} disabled={payingBillId}>
                                {payingBillId ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayBills;