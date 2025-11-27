import React, { useEffect, useState } from "react";
import "./styles/LoanStatus.css";
import { Link, useNavigate } from "react-router-dom";
import { getMyLoans } from "../../services/loanAPI";
import { FaCheckCircle, FaClock, FaTimesCircle, FaFileInvoiceDollar, FaPlus } from "react-icons/fa";

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
  const approvedLoans = loans.filter((l) => l.status === "APPROVED" || l.status === "COMPLETED");
  const pendingLoans = loans.filter((l) => l.status === "PENDING");
  const rejectedLoans = loans.filter((l) => l.status === "REJECTED");
  const completedLoans = loans.filter((l) => l.status === "COMPLETED");

  const totalApprovedAmount = approvedLoans
    .reduce((sum, l) => sum + Number(l.loanAmount), 0)
    .toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const loanStats = {
    approved: approvedLoans.length,
    pending: pendingLoans.length,
    rejected: rejectedLoans.length,
    total: loans.length,
    approvedAmount: `₹${totalApprovedAmount}`,
  };

  /* ------------------- Loading / Error UI ------------------- */
  if (loading) return <div className="zen-status-container loading">Loading loan data...</div>;
  if (error) return <div className="zen-status-container error">{error}</div>;

  return (
    <div className="zen-status-container">

      {/* Page Header */}
      <div className="zen-status-header">
        <div>
          <h1>Loan Status</h1>
          <p>Track and manage your loan applications in real-time.</p>
        </div>

        <Link to="/dashboard/request-loan">
          <button className="zen-add-btn">
            <FaPlus /> New Loan
          </button>
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="zen-dashboard-grid">
        <div className="zen-stat-card approved">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info">
            <span className="stat-label">Approved Loans</span>
            <h2 className="stat-value">{loanStats.approved}</h2>
            <span className="stat-sub">Total: {loanStats.approvedAmount}</span>
          </div>
        </div>

        <div className="zen-stat-card pending">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Review</span>
            <h2 className="stat-value">{loanStats.pending}</h2>
            <span className="stat-sub">Under process</span>
          </div>
        </div>

        <div className="zen-stat-card total">
          <div className="stat-icon"><FaFileInvoiceDollar /></div>
          <div className="stat-info">
            <span className="stat-label">Total Applications</span>
            <h2 className="stat-value">{loanStats.total}</h2>
            <span className="stat-sub">All time</span>
          </div>
        </div>
      </div>

      {/* Loan Applications Table */}
      <div className="zen-table-section">
        <h3 className="section-title">Your Applications</h3>

        {loans.length === 0 ? (
          <div className="empty-state">
            <p>No loan applications found.</p>
            <Link to="/dashboard/request-loan" className="empty-action">Apply Now</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="zen-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Type</th>
                  <th>Applied Date</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="id-cell">#{loan.id}</td>
                    <td className="amount-cell">₹{Number(loan.loanAmount).toLocaleString("en-IN")}</td>
                    <td>{loan.tenureMonths} Mo</td>
                    <td><span className="type-badge">{loan.loanType}</span></td>
                    <td>{loan.createdAt?.slice(0, 10)}</td>
                    <td>{loan.interestRate}%</td>

                    <td>
                      <span
                        className={`zen-status-badge ${loan.status.toLowerCase()}`}
                      >
                        {loan.status === 'APPROVED' && <FaCheckCircle />}
                        {loan.status === 'COMPLETED' && <FaCheckCircle />}
                        {loan.status === 'PENDING' && <FaClock />}
                        {loan.status === 'REJECTED' && <FaTimesCircle />}
                        {loan.status}
                      </span>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td>
                      {loan.status === "APPROVED" ? (
                        <button
                          className="zen-action-btn"
                          onClick={() => navigate(`/dashboard/pay-bills?loanId=${loan.id}`)}
                        >
                          View Bills
                        </button>
                      ) : (
                        <span className="no-action">-</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanStatus;