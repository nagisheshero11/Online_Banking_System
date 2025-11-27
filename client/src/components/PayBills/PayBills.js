import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaBolt, FaWifi, FaMobileAlt, FaFire, FaCheckCircle, FaUniversity, FaCreditCard } from "react-icons/fa";
import { getMyBills, payBill, getBillsByLoan } from "../../services/billsAPI";
import BillPaymentModal from "./BillPaymentModal";
import ConfirmationModal from "../Common/ConfirmationModal";
import { useToast } from "../../context/ToastContext";
import "./styles/PayBills.css";

const PayBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingBillId, setPayingBillId] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null); // For modal
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Confirmation Modal State
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmTitle, setConfirmTitle] = useState("");

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
            showToast("Failed to load bills", "error");
        } finally {
            setLoading(false);
        }
    };

    const openPaymentModal = (bill) => {
        setSelectedBill(bill);
    };

    const handlePaymentSuccess = async () => {
        await fetchBills();
        showToast("Bill paid successfully! Transaction recorded.", "success");
        setSelectedBill(null);
    };

    const handlePayAllClick = () => {
        const outstanding = bills.filter(b => b.status === "UNPAID" || b.status === "OVERDUE");
        if (outstanding.length === 0) return;

        setConfirmTitle("Pay All Dues");
        setConfirmMessage(`Are you sure you want to pay all ${outstanding.length} outstanding bills? Total amount: ${currency(totalDue)}`);
        setConfirmAction(() => () => executePayAll(outstanding));
        setIsConfirmModalOpen(true);
    };

    const executePayAll = async (outstanding) => {
        setIsConfirmModalOpen(false);
        for (let b of outstanding) {
            try {
                setPayingBillId(b.id);
                await payBill(b.id);
            } catch (e) {
                console.error(e);
                showToast(`Failed to pay bill #${b.id}`, "error");
            }
        }
        await fetchBills();
        setPayingBillId(null);
        showToast("All dues paid successfully!", "success");
    };

    const totalDue = bills
        .filter(b => b.status === "UNPAID" || b.status === "OVERDUE")
        .reduce((sum, b) => sum + Number(b.amount), 0);

    const currency = (n) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    const getBillIcon = (bill) => {
        if (bill.loanId) return <FaUniversity />;
        if (bill.billType === "CREDIT_CARD") return <FaCreditCard />;

        const t = (bill.type || "").toLowerCase();
        if (t.includes("electric")) return <FaBolt />;
        if (t.includes("internet") || t.includes("wifi")) return <FaWifi />;
        if (t.includes("mobile") || t.includes("phone")) return <FaMobileAlt />;
        if (t.includes("gas")) return <FaFire />;
        return <FaBolt />; // Default
    };

    const getBillTitle = (bill) => {
        if (bill.loanId) return `Loan Payment #${bill.id}`;
        if (bill.billType === "CREDIT_CARD") return `Credit Card Bill #${bill.id}`;
        return `Bill #${bill.id}`;
    };

    return (
        <div className="pay-bills-container">
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
                            <button className="pay-all-btn" onClick={handlePayAllClick}>
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
                                    {getBillTitle(bill)}
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
                <BillPaymentModal
                    bill={selectedBill}
                    onClose={() => setSelectedBill(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmAction}
                title={confirmTitle}
                message={confirmMessage}
                confirmText="Pay All"
            />
        </div>
    );
};

export default PayBills;