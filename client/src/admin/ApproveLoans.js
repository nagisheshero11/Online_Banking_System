// client/src/admin/ApproveLoans.jsx

import React, { useEffect, useState } from "react";
import "./styles/ApproveLoans.css";
import { getAllLoans, approveLoan, rejectLoan } from "./services/adminLoanAPI";

const ApproveLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

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
            alert(err.message || "Failed to load loans");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadLoans();
    }, []);

    /* -----------------------------------------
       HANDLE APPROVE
    ----------------------------------------- */
    const handleApprove = async (loanId) => {
        if (!window.confirm("Approve this loan?")) return;

        setProcessingId(loanId);

        try {
            await approveLoan(loanId);
            alert("Loan Approved Successfully!");
            await loadLoans(); // refresh table
        } catch (err) {
            console.error("Approve error:", err);
            alert(err.message || "Failed to approve loan");
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
            alert("Loan Rejected");
            await loadLoans();
        } catch (err) {
            console.error("Reject error:", err);
            alert(err.message || "Failed to reject loan");
        }

        setProcessingId(null);
    };

    /* -----------------------------------------
       UI RENDER
    ----------------------------------------- */
    if (loading) return <div className="approve-loans">Loading...</div>;

    return (
        <div className="approve-loans">
            {loans.length === 0 ? (
                <p>No pending loans.</p>
            ) : (
                loans.map((loan) => (
                    <div className="loan-req-box" key={loan.id}>
                        <div>
                            <h3>{loan.username}</h3>
                            <p>Amount: ₹{Number(loan.loanAmount).toLocaleString()}</p>
                            <p>Type: {loan.loanType}</p>
                            <small>Applied on: {loan.createdAt?.slice(0, 10)}</small>
                        </div>

                        <div className="loan-actions">
                            <button
                                className="approve-btn"
                                disabled={processingId === loan.id}
                                onClick={() => handleApprove(loan.id)}
                            >
                                {processingId === loan.id ? "Processing..." : "Approve"}
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
        </div>
    );
};

export default ApproveLoans;