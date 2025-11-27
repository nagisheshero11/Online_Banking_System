// client/src/admin/ApproveLoans.jsx

import React, { useEffect, useState } from "react";
import "./styles/ApproveLoans.css";
import { getAllLoans, approveLoan, rejectLoan } from "./services/adminLoanAPI";

import { useToast } from '../context/ToastContext';

const ApproveLoans = () => {
    const { showToast } = useToast();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [selectedLoan, setSelectedLoan] = useState(null); // For confirmation modal

    /* -----------------------------------------
       LOAD PENDING LOANS
    ----------------------------------------- */
    const loadLoans = async () => {
        setLoading(true);
        try {
            const data = await getAllLoans();
            setLoans(data.filter((loan) => loan.status === "PENDING"));
        } catch (err) {
            console.error("Loan load error:", err);
            showToast(err.message || "Failed to load loans", 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadLoans();
    }, []);

    /* -----------------------------------------
       HANDLE APPROVE
    ----------------------------------------- */
    const confirmApprove = (loan) => {
        setSelectedLoan(loan);
    };

    const handleApprove = async () => {
        if (!selectedLoan) return;
        setProcessingId(selectedLoan.id);

        try {
            await approveLoan(selectedLoan.id);
            showToast("Loan Approved Successfully!", 'success');
            await loadLoans(); // refresh table
            setSelectedLoan(null); // Close modal
        } catch (err) {
            console.error("Approve error:", err);
            showToast(err.message || "Failed to approve loan", 'error');
        }

        setProcessingId(null);
    };

    /* -----------------------------------------
       HANDLE REJECT
    ----------------------------------------- */
    const handleReject = async (loanId) => {
        if (!window.confirm("Reject this loan?")) return;

        setProcessingId(loanId);

        try {
            await rejectLoan(loanId);
            showToast("Loan Rejected", 'info');
            await loadLoans();
        } catch (err) {
            console.error("Reject error:", err);
            showToast(err.message || "Failed to reject loan", 'error');
        }

        setProcessingId(null);
    };

    /* -----------------------------------------
       UI RENDER
    ----------------------------------------- */
    if (loading) return <div className="approve-loans">Loading...</div>;

    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">Approve Loans</h1>
                <p className="admin-page-subtitle">Review and take action on pending loan applications.</p>
            </div>

            {loans.length === 0 ? (
                <div className="empty-state">No pending loans found.</div>
            ) : (
                loans.map((loan) => (
                    <div className="loan-req-box" key={loan.id}>
                        <div>
                            <h3>{loan.fullName} (@{loan.username})</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', fontSize: '0.9rem', color: '#475569' }}>
                                <div><strong>Amount:</strong> ₹{Number(loan.loanAmount).toLocaleString()}</div>
                                <div><strong>Type:</strong> {loan.loanType}</div>
                                <div><strong>Account:</strong> {loan.accountNumber}</div>
                                <div><strong>Current Bal:</strong> ₹{Number(loan.currentBalance).toLocaleString()}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong>Applied:</strong> {new Date(loan.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="loan-actions">
                            <button
                                className="approve-btn"
                                disabled={processingId === loan.id}
                                onClick={() => confirmApprove(loan)}
                            >
                                Approve
                            </button>

                            <button
                                className="reject-btn"
                                disabled={processingId === loan.id}
                                onClick={() => handleReject(loan.id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Confirmation Modal */}
            {selectedLoan && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Loan Approval</h3>
                        <p>Are you sure you want to approve this loan?</p>

                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', margin: '20px 0', fontSize: '0.95rem' }}>
                            <div className="summary-row"><span>Applicant:</span> <strong>{selectedLoan.fullName}</strong></div>
                            <div className="summary-row"><span>Loan Amount:</span> <strong>₹{Number(selectedLoan.loanAmount).toLocaleString()}</strong></div>
                            <div className="summary-row"><span>Current Balance:</span> <strong>₹{Number(selectedLoan.currentBalance).toLocaleString()}</strong></div>

                            <div style={{ margin: '10px 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '10px 0' }}>
                                <div className="summary-row" style={{ fontSize: '0.85rem', color: '#64748B' }}><span>Total Applied:</span> <strong>{selectedLoan.totalLoansApplied}</strong></div>
                                <div className="summary-row" style={{ fontSize: '0.85rem', color: '#16A34A' }}><span>Approved:</span> <strong>{selectedLoan.loansApproved}</strong></div>
                                <div className="summary-row" style={{ fontSize: '0.85rem', color: '#EF4444' }}><span>Rejected:</span> <strong>{selectedLoan.loansRejected}</strong></div>
                            </div>

                            <div className="summary-row total">
                                <span>New Balance:</span>
                                <strong style={{ color: '#16A34A' }}>
                                    ₹{(Number(selectedLoan.currentBalance) + Number(selectedLoan.loanAmount)).toLocaleString()}
                                </strong>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setSelectedLoan(null)}>Cancel</button>
                            <button className="confirm-btn" onClick={handleApprove} disabled={processingId === selectedLoan.id}>
                                {processingId === selectedLoan.id ? "Processing..." : "Confirm Approval"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveLoans;