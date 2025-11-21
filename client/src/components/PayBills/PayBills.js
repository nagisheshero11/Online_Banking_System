// client/src/components/PayBills/PayBills.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./styles/PayBills.css";

// ✅ Correct import (your file name is billAPI.js)
import { getMyBills, payBill, getBillsByLoan } from "../../services/billsAPI";

const formatCurrency = (value) =>
    Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const PayBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingBillId, setPayingBillId] = useState(null);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const loanIdParam = searchParams.get("loanId");

    /* ---------------- Fetch Bills ---------------- */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                let data;

                if (loanIdParam) {
                    data = await getBillsByLoan(loanIdParam);
                } else {
                    data = await getMyBills();
                }

                setBills(
                    (data || []).map((b) => ({
                        ...b,
                        amount: Number(b.amount),
                        dueDate: b.dueDate ? String(b.dueDate) : null,
                    }))
                );
            } catch (err) {
                console.error("Bills fetch error:", err);
                setError(err.message || "Failed to fetch bills");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [loanIdParam]);

    /* ---------------- Summary ---------------- */
    const totalDue = bills
        .filter((b) => b.status === "UNPAID" || b.status === "OVERDUE")
        .reduce((sum, b) => sum + Number(b.amount), 0);

    /* ---------------- Pay One Bill ---------------- */
    const handlePay = async (billId) => {
        if (!window.confirm("Do you want to pay this bill?")) return;

        setPayingBillId(billId);

        try {
            await payBill(billId); // ✅ now matches backend
            const refreshed = loanIdParam
                ? await getBillsByLoan(loanIdParam)
                : await getMyBills();

            setBills(
                refreshed.map((b) => ({
                    ...b,
                    amount: Number(b.amount),
                }))
            );

            alert("Payment successful!");
        } catch (err) {
            console.error("Pay bill error:", err);
            alert(err.message || "Payment failed");
        } finally {
            setPayingBillId(null);
        }
    };

    if (loading) return <div className="pay-bills-page">Loading bills...</div>;
    if (error) return <div className="pay-bills-page">{error}</div>;

    return (
        <div className="pay-bills-page">

            {/* Header */}
            <div className="page-header-wrapper">
                <div className="page-header">
                    <h1 className="header-title">Pay Bills</h1>
                    <p className="header-subtitle">Pay EMI / monthly interest for approved loans.</p>
                </div>
            </div>

            {/* Outstanding Summary */}
            <div className="bill-selector-container">
                <div className="bill-selector-card">

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h3 className="selector-title">Outstanding Summary</h3>
                        <div style={{ marginLeft: "auto", fontWeight: 700 }}>
                            Total Due: ₹{formatCurrency(totalDue)}
                        </div>
                    </div>

                    <div className="payment-summary" style={{ marginTop: 15 }}>
                        <div className="summary-title-text">Quick Info</div>

                        <div className="summary-line">
                            <div className="summary-label">Unpaid Bills</div>
                            <div className="summary-value">
                                {bills.filter((b) => b.status === "UNPAID").length}
                            </div>
                        </div>

                        <div className="summary-line">
                            <div className="summary-label">Overdue</div>
                            <div className="summary-value">
                                {bills.filter((b) => b.status === "OVERDUE").length}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bill List */}
            <div className="payment-form-card">
                <div className="form-header-banner" style={{ background: "#1A1A1A" }}>
                    <div className="bill-name">Your Bills</div>
                    <div className="balance-info">Pay on time to avoid penalties</div>
                </div>

                {bills.length === 0 ? (
                    <div style={{ padding: 20 }}>
                        <p>No bills found.</p>
                        <button
                            className="btn-cancel"
                            onClick={() => navigate("/dashboard/loan-status")}
                        >
                            Back to Loan Status
                        </button>
                    </div>
                ) : (
                    <>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #eee" }}>
                                    <th>Bill ID</th>
                                    <th>Loan ID</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bills.map((b) => (
                                    <tr key={b.id} style={{ borderBottom: "1px solid #f3f3f3" }}>
                                        <td>{b.id}</td>
                                        <td>{b.loanId || "-"}</td>
                                        <td>₹{formatCurrency(b.amount)}</td>
                                        <td>{b.dueDate || "-"}</td>
                                        <td>{b.status}</td>

                                        <td style={{ textAlign: "right" }}>
                                            {b.status === "UNPAID" || b.status === "OVERDUE" ? (
                                                <button
                                                    className="btn-pay"
                                                    onClick={() => handlePay(b.id)}
                                                    disabled={payingBillId === b.id}
                                                >
                                                    {payingBillId === b.id
                                                        ? "Processing..."
                                                        : "Pay Now"}
                                                </button>
                                            ) : (
                                                <button className="btn-cancel" disabled>
                                                    Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Payment Summary */}
                        <div className="payment-summary" style={{ marginTop: 20 }}>
                            <div className="summary-title-text">Payment Summary</div>

                            <div className="summary-line">
                                <div className="summary-label">Total Due</div>
                                <div className="summary-value">₹{formatCurrency(totalDue)}</div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                                <button
                                    className="btn-pay"
                                    onClick={async () => {
                                        if (!window.confirm("Pay ALL outstanding bills?")) return;

                                        const outstanding = bills.filter(
                                            (x) => x.status === "UNPAID" || x.status === "OVERDUE"
                                        );

                                        for (let b of outstanding) {
                                            try {
                                                setPayingBillId(b.id);
                                                await payBill(b.id);
                                            } catch {
                                                alert("Failed to pay bill " + b.id);
                                            }
                                        }

                                        const refreshed = loanIdParam
                                            ? await getBillsByLoan(loanIdParam)
                                            : await getMyBills();

                                        setBills(
                                            refreshed.map((r) => ({ ...r, amount: Number(r.amount) }))
                                        );

                                        alert("All bills paid.");
                                        setPayingBillId(null);
                                    }}
                                >
                                    Pay All (₹{formatCurrency(totalDue)})
                                </button>

                                <button
                                    className="btn-cancel"
                                    style={{ marginLeft: 12 }}
                                    onClick={() => navigate("/dashboard/loan-status")}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default PayBills;