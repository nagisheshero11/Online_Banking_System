import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './styles/AccountDetails.css';
import { FaUserCircle, FaCalendarAlt, FaInfoCircle, FaChevronRight, FaArrowDown, FaArrowUp } from 'react-icons/fa';

const currency = (n) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'INR' });

const maskAccount = (acc = '') => {
  const s = String(acc);
  const last = s.slice(-4);
  return '********' + last;
};

const AccountDetails = ({ accountNumber = '----', currentBalance = 0, transactions = [] }) => {
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  // Pull the same shared data used by the Dashboard index route
  const shared = useOutletContext();
  const data = shared || {
    accountNumber: '********1234',
    currentBalance: 7450.8,
    transactions: [
      { id: 1, date: '2024-10-26', description: 'Coffee Shop', amount: -2100.0 },
      { id: 2, date: '2024-10-24', description: 'Salary Deposit', amount: 85.0 },
    ],
  };

  // Support props as an override if provided explicitly
  const accNum = accountNumber !== '----' ? accountNumber : data.accountNumber;
  const balance = currentBalance !== 0 ? currentBalance : data.currentBalance;
  const txns = (transactions && transactions.length > 0) ? transactions : data.transactions;
  return (
    <div className="account-details-root">
      <div className="account-summary-card">
        <div className="summary-holder-row">
          <div>
            <div className="summary-label">Account Holder</div>
            <h3 className="summary-holder-name">John Doe</h3>
            <p className="summary-account-number">{maskAccount(accNum)}</p>
          </div>
          <div className="summary-icon"><FaUserCircle /></div>
        </div>

        <div className="summary-balance-row">
          <div>
            <div className="summary-label">Current Balance</div>
            <div className="summary-balance-value">{currency(balance)}</div>
          </div>
          <div className="summary-type-info">
            <div className="summary-account-type">Savings Account</div>
            <div className="summary-sub">Joined Jan 2024</div>
          </div>
        </div>
        <FaChevronRight className="balance-chevron" aria-hidden />
      </div>

      <div className="account-info-details">
        <div className="info-section-title">Account Information</div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon-badge blue"><FaCalendarAlt /></div>
            <div className="info-text">
              <div className="info-label">Opened</div>
              <div className="info-value">01 Jan 2024</div>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-badge green"><FaInfoCircle /></div>
            <div className="info-text">
              <div className="info-label">Account Type</div>
              <div className="info-value">Savings</div>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-badge purple">₹</div>
            <div className="info-text">
              <div className="info-label">Available Balance</div>
              <div className="info-value balance-value">{currency(currentBalance)}</div>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-badge orange">#</div>
            <div className="info-text">
              <div className="info-label">Branch</div>
              <div className="info-value">MG Road, Hyderabad</div>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <div className="info-section-title">Recent Activity</div>
        <div className="transactions-list">
          {(!txns || txns.length === 0) && <div className="tx-empty">No transactions yet.</div>}
          {(txns || []).map((t) => {
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
                  <time className="tx-sub" dateTime={t.date}>{formatDate(t.date)}</time>
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
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;