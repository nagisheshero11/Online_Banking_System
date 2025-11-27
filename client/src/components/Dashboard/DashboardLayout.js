import './styles/DashboardLayout.css';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaHistory, FaCog, FaArrowDown, FaArrowUp, FaChevronRight } from 'react-icons/fa';

const currency = (n) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'INR' });

const DashboardLayout = ({ accountNumber, currentBalance, transactions }) => {
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <>
      {/* Summary cards row */}
      <section className="summary-row">
        {/* Balance card spans full width of first row */}
        <div className="summary-card balance">
          <div className="summary-title">Current Balance</div>
          <div className="summary-value">{currency(currentBalance)}</div>
          <div className="summary-sub">{accountNumber}</div>
          <FaChevronRight className="balance-chevron" aria-hidden />
        </div>

        {/* Two mini summary cards */}
        <div className="summary-card mini income">
          <div className="mini-icon" aria-hidden>
            <FaArrowUp />
          </div>
          <div className="mini-content">
            <div className="summary-title">Total Income</div>
            <div className="summary-value">₹15,000</div>
          </div>
        </div>

        <div className="summary-card mini spending">
          <div className="mini-icon" aria-hidden>
            <FaArrowDown />
          </div>
          <div className="mini-content">
            <div className="summary-title">Total Spending</div>
            <div className="summary-value">₹4,350</div>
          </div>
        </div>
      </section>

      {/* Quick Actions large buttons row */}
      <section className="quick-actions-row card">
        <div className="qa-title">Smart Actions</div>
        <div className="qa-buttons">
          <Link to="/dashboard/transfer-money" className="qa-btn">
            <FaExchangeAlt />
            <span className="qa-label">Transfer</span>
          </Link>

          <Link to="/dashboard/transactions" className="qa-btn">
            <FaHistory />
            <span className="qa-label">History</span>
          </Link>

          <Link to="/dashboard/profile" className="qa-btn">
            <FaCog />
            <span className="qa-label">Settings</span>
          </Link>
        </div>
      </section>

      {/* Recent Transactions list */}
      <section className="dashboard-section">
        <div className="card recent-transactions">
          <div className="rt-header">
            <h3 className="card-title">Recent Activity</h3>
            <div className="rt-controls">
              <button type="button" className="rt-filter">Filter</button>
              <Link className="view-all" to="/dashboard/transactions">View All</Link>
            </div>
          </div>

          <div className="transactions-list">
            {transactions && transactions.length > 0 ? (
              transactions.map((t) => {
                const isDebit = t.amount < 0;
                const sign = isDebit ? '-' : '+';
                const typeLabel = isDebit ? 'Expense' : 'Deposit';
                return (
                  <div key={t.id} className="transaction-row">
                    <div className={`tx-icon-circle ${isDebit ? 'debit' : 'credit'}`} aria-hidden>
                      {isDebit ? (
                        <FaArrowDown className="tx-icon-svg" />
                      ) : (
                        <FaArrowUp className="tx-icon-svg" />
                      )}
                    </div>

                    <div className="tx-main">
                      <div className="tx-desc">{t.description}</div>
                      <time className="tx-date" dateTime={t.date}>{formatDate(t.date)}</time>
                    </div>

                    <div className={`tx-amount-pill ${isDebit ? 'debit' : 'credit'}`}>
                      <span className="tx-amount-sign">{sign}</span>
                      <span className="tx-amount-value">{currency(Math.abs(t.amount))}</span>
                    </div>

                    <div className="tx-type">
                      <span className={`tx-chip ${isDebit ? 'debit' : 'credit'}`}>{typeLabel}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="tx-empty">
                <div className="tx-empty-title">No recent transactions</div>
                <div className="tx-empty-sub">Your latest activity will appear here.</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardLayout;