import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaBolt, FaWifi, FaMobileAlt, FaFire, FaCheckCircle, FaUniversity, FaCreditCard } from "react-icons/fa";
import { getMyBills, payBill, getBillsByLoan } from "../../services/billsAPI";
import BillPaymentModal from "./BillPaymentModal";
import ConfirmationModal from "../Common/ConfirmationModal";
import { useToast } from "../../context/ToastContext";
import "./styles/PayBills.css"; // Reuse styles

const PayEMI = () => {
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

            // Filter for EMI bills only
            const emiBills = (data || []).filter(b => b.billType === "EMI");

            setBills(emiBills.map(b => ({
                ...b,
                amount: Number(b.amount),
                dueDate: b.dueDate ? String(b.dueDate) : null,
            })));
        } catch (err) {
            console.error("Bills fetch error:", err);
            showToast("Failed to load EMIs", "error");
        } finally {
            setLoading(false);
        }
    };

    const openPaymentModal = (bill) => {
        setSelectedBill(bill);
    };

    const handlePaymentSuccess = async () => {
        await fetchBills();
        showToast("EMI paid successfully! Transaction recorded.", "success");
        setSelectedBill(null);
    };

    const handlePayAllClick = () => {
        const outstanding = bills.filter(b => b.status === "UNPAID" || b.status === "OVERDUE");
        if (outstanding.length === 0) return;

        setConfirmTitle("Pay All EMIs");
        setConfirmMessage(`Are you sure you want to pay all ${outstanding.length} outstanding EMIs? Total amount: ${currency(totalDue)}`);
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
                showToast(`Failed to pay EMI #${b.id}`, "error");
            }
        }
        await fetchBills();
        setPayingBillId(null);
        showToast("All EMIs paid successfully!", "success");
    };

    const totalDue = bills
        .filter(b => b.status === "UNPAID" || b.status === "OVERDUE")
        .reduce((sum, b) => sum + Number(b.amount), 0);

    const currency = (n) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    const getBillIcon = (bill) => {
        return <FaUniversity />; // Always loan icon for EMI
    };

    const getBillTitle = (bill) => {
        return `Loan Payment #${bill.id}`;
    };

    return (
        <div className="pay-bills-container">
            {/* Left: Visual Guide */}
            <div className="bills-visual">
                <div className="visual-bg"></div>

                <div className="visual-content">
                    <div>
                        <div className="visual-title">Pay Your<br />EMIs</div>
                        <div className="visual-subtitle">Ensure timely loan repayments to maintain a good credit score.</div>
                    </div>

                    <div className="total-due-card">
                        <div className="due-label">Total EMI Due</div>
                        <div className="due-value">{currency(totalDue)}</div>

                        {totalDue > 0 && (
                            <button className="pay-all-btn" onClick={handlePayAllClick}>
                                Pay All EMIs
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Bill List */}
            <div className="bills-list">
                <div className="list-header">
                    <div className="list-title">Your EMIs</div>
                </div>

                {loading ? (
                    <div className="empty-state">Loading EMIs...</div>
                ) : bills.length === 0 ? (
                    <div className="empty-state">No pending EMIs found. Great job! 🎉</div>
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

export default PayEMI;
