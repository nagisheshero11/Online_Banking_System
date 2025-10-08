import React from 'react';
import './styles/AccountDetails.css';
import { FaUserCircle, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const currency = (n) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'INR' });

const AccountDetails = ({ accountNumber = '----', currentBalance = 0, transactions = [] }) => {
  return (
    <div className="account-details-root">
      <div className="account-summary-card">
        <div className="summary-holder-row">
          <div>
            <div className="summary-label">Account Holder</div>
            <h3 className="summary-holder-name">John Doe</h3>
            <p className="summary-account-number">{accountNumber}</p>
          </div>
          <div className="summary-icon"><FaUserCircle /></div>
        </div>

        <div className="summary-balance-row">
          <div>
            <div className="summary-label">Current Balance</div>
            <div className="summary-balance-value">{currency(currentBalance)}</div>
          </div>
          <div className="summary-type-info">
            <div className="summary-account-type">Savings Account</div>
            <div className="summary-sub">Joined Jan 2024</div>
          </div>
        </div>
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
          {transactions.length === 0 && <div className="tx-empty">No transactions yet.</div>}
          {transactions.map((t) => (
            <div key={t.id} className="transaction-row">
              <div className={`tx-icon ${t.amount < 0 ? 'out' : 'in'}`} aria-hidden></div>
              <div className="tx-main">
                <div className="tx-desc">{t.description}</div>
                <div className="tx-sub">{t.date}</div>
              </div>
              <div className={`tx-amount ${t.amount < 0 ? 'debit' : 'credit'}`}>
                {t.amount < 0 ? '-' : '+'}{currency(Math.abs(t.amount))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;