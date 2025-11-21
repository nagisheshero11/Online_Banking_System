import React, { useEffect, useState } from "react";
import "./styles/LoanStatus.css";
import { Link, useNavigate } from "react-router-dom";
import { getMyLoans } from "../../services/loanAPI";

const LoanStatus = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /* ------------------- Fetch Loan Data ------------------- */
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getMyLoans();
        setLoans(data);
      } catch (err) {
        console.error("Loan Fetch Error:", err);
        setError("Failed to load loan data");
      }
      setLoading(false);
    };

    fetchLoans();
  }, []);

  /* ------------------- Summary Calculations ------------------- */
  const approvedLoans = loans.filter((l) => l.status === "APPROVED");
  const pendingLoans = loans.filter((l) => l.status === "PENDING");

  const totalApprovedAmount = approvedLoans
    .reduce((sum, l) => sum + Number(l.loanAmount), 0)
    .toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const loanStats = {
    approved: approvedLoans.length,
    pending: pendingLoans.length,
    total: loans.length,
    approvedAmount: `₹${totalApprovedAmount}`,
  };

  /* ------------------- Loading / Error UI ------------------- */
  if (loading) return <div className="loan-status-container">Loading loan data...</div>;
  if (error) return <div className="loan-status-container error">{error}</div>;

  return (
    <div className="loan-status-container">

      {/* Page Header */}
      <div className="loan-status-header">
        <div>
          <h2>Loan Status</h2>
          <p>Track your loan applications</p>
        </div>

        <Link to="/dashboard/request-loan">
          <button className="request-loan-btn">+ Request New Loan</button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="loan-summary">
        <div className="summary-card approved">
          <p>Approved Loans</p>
          <h2>{loanStats.approved}</h2>
          <span>Total: {loanStats.approvedAmount}</span>
        </div>

        <div className="summary-card pending">
          <p>Pending Loans</p>
          <h2>{loanStats.pending}</h2>
          <span>Under review</span>
        </div>

        <div className="summary-card total">
          <p>Total Applications</p>
          <h2>{loanStats.total}</h2>
          <span>All time</span>
        </div>
      </div>

      {/* Loan Applications Table */}
      <div className="loan-applications">
        <h3>Your Loan Applications</h3>

        {loans.length === 0 ? (
          <p>No loan applications found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Amount</th>
                <th>Tenure</th>
                <th>Type</th>
                <th>Applied Date</th>
                <th>Interest Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>₹{Number(loan.loanAmount).toLocaleString("en-IN")}</td>
                  <td>{loan.tenureMonths} months</td>
                  <td>{loan.loanType}</td>
                  <td>{loan.createdAt?.slice(0, 10)}</td>
                  <td>{loan.interestRate}% p.a.</td>

                  <td>
                    <span
                      className={`status-badge ${loan.status === "APPROVED"
                          ? "approved"
                          : loan.status === "PENDING"
                            ? "pending"
                            : "rejected"
                        }`}
                    >
                      {loan.status}
                    </span>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td>
                    {loan.status === "APPROVED" ? (
                      <button
                        className="view-bills-btn"
                        onClick={() => navigate(`/dashboard/pay-bills?loanId=${loan.id}`)}
                      >
                        View Bills
                      </button>
                    ) : (
                      <button className="view-bills-btn disabled">No Bills</button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Status Guide */}
      <div className="status-guide">
        <h3>Loan Application Status Guide</h3>
        <div className="guide-cards">
          <div className="guide-card pending">
            <strong>Pending</strong>
            <p>Application is under review</p>
          </div>

          <div className="guide-card approved">
            <strong>Approved</strong>
            <p>Your loan has been approved</p>
          </div>

          <div className="guide-card rejected">
            <strong>Rejected</strong>
            <p>Application was not approved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatus;