import React from "react";
import "./styles/LoanStatus.css";

const LoanStatus = () => {
  const loanStats = {
    approved: 1,
    pending: 1,
    total: 2,
    approvedAmount: "₹2,00,000",
  };

  const loanApplications = [
    {
      id: "LOAN001",
      amount: "₹2,00,000",
      tenure: "24 months",
      purpose: "Home Renovation",
      date: "2025-06-01",
      rate: "8.5% p.a.",
      status: "Approved",
    },
    {
      id: "LOAN002",
      amount: "₹50,000",
      tenure: "12 months",
      purpose: "Personal",
      date: "2025-07-10",
      rate: "10.5% p.a.",
      status: "Pending",
    },
  ];

  return (
    <div className="loan-status-container">
      <div className="loan-status-header">
        <div>
          <h2>Loan Status</h2>
          <p>Track your loan applications</p>
        </div>
        <button className="request-loan-btn">+ Request New Loan</button>
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
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Amount</th>
              <th>Tenure</th>
              <th>Purpose</th>
              <th>Applied Date</th>
              <th>Interest Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loanApplications.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.amount}</td>
                <td>{loan.tenure}</td>
                <td>{loan.purpose}</td>
                <td>{loan.date}</td>
                <td>{loan.rate}</td>
                <td>
                  <span
                    className={`status-badge ${
                      loan.status === "Approved"
                        ? "approved"
                        : loan.status === "Pending"
                        ? "pending"
                        : "rejected"
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <p>Loan has been approved</p>
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
