import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/AccountDetails.css';
import { FaExchangeAlt, FaFileInvoice, FaCog, FaEye, FaEyeSlash, FaCheck, FaPen } from 'react-icons/fa';
import { getAccountDetails, updateTransactionLimit } from '../../services/accountAPI';

const currency = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'INR' });

const AccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState('');
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getAccountDetails();
        setAccount(data);
      } catch (err) {
        setError('Failed to load account details.');
      }
    };
    fetchAccount();
  }, []);

  const handleLimitUpdate = async () => {
    setError('');
    setSuccess('');

    if (!newLimit || parseFloat(newLimit) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      const message = await updateTransactionLimit(parseFloat(newLimit));
      setSuccess(message);

      const updated = await getAccountDetails();
      setAccount(updated);

      setIsEditing(false);
      setNewLimit('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!account) return <div className="loading-state">Loading portal...</div>;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  const displayAccountNumber = showAccountNumber
    ? account.accountNumber
    : '•••• •••• •••• ' + String(account.accountNumber).slice(-4);

  // Calculate limit percentage for the power bar (max limit is 200,000)
  const limitPercentage = Math.min((account.transactionLimit / 200000) * 100, 100);

  return (
    <div className="account-details-root">
      {/* Header */}
      <div className="portal-header">
        <div>
          <div className="header-greeting">Welcome back,</div>
          <div className="header-username">{account.firstName} {account.lastName}</div>
        </div>
        <div className="header-actions">
          <Link to="/dashboard/transfer-money" className="portal-action-btn">
            <FaExchangeAlt /> Transfer
          </Link>
          <Link to="/dashboard/transactions" className="portal-action-btn">
            <FaFileInvoice /> History
          </Link>
          <Link to="/dashboard/profile" className="portal-action-btn">
            <FaCog /> Settings
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="portal-grid">

        {/* Left: Zen Balance Tile */}
        <div className="balance-tile-container">
          <div className="mesh-gradient-bg"></div>
          <div className="mesh-orb-1"></div>
          <div className="mesh-orb-2"></div>

          <div className="balance-content">
            <div className="balance-label">Total Available Balance</div>
            <div className="balance-amount">{currency(account.balance)}</div>
            <div className="balance-status">
              <span style={{ fontSize: '1.2em' }}>●</span> Active & Secure
            </div>
          </div>
        </div>

        {/* Right: Data HUD */}
        <div className="portal-data-hud">

          {/* Account Specs */}
          <div className="hud-section">
            <div className="hud-section-title">Account Specifications</div>

            <div className="spec-row">
              <span className="spec-label">Account Number</span>
              <div className="account-number-group">
                <span className="spec-value">{displayAccountNumber}</span>
                <button
                  className="reveal-btn"
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                >
                  {showAccountNumber ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="spec-row">
              <span className="spec-label">IFSC Code</span>
              <span className="spec-value">{account.ifscCode}</span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Account Type</span>
              <span className="spec-value highlight">{account.accountType}</span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Member Since</span>
              <span className="spec-value">{formatDate(account.createdAt)}</span>
            </div>
          </div>

          {/* Transaction Limit Power Bar */}
          <div className="limit-power-container">
            <div className="power-header">
              <span className="power-label">Transaction Limit</span>
              {!isEditing && (
                <span className="power-value">{currency(account.transactionLimit)}</span>
              )}
            </div>

            {!isEditing ? (
              <>
                <div className="power-bar-wrapper">
                  <div className="power-bar-fill" style={{ width: `${limitPercentage}%` }}></div>
                </div>
                <button className="portal-action-btn" onClick={() => setIsEditing(true)}>
                  <FaPen /> Adjust Limit
                </button>
              </>
            ) : (
              <div className="edit-limit-row">
                <input
                  type="number"
                  className="hud-input"
                  value={newLimit}
                  placeholder="Enter new limit"
                  onChange={(e) => setNewLimit(e.target.value)}
                />
                <button className="hud-btn" onClick={handleLimitUpdate}>
                  <FaCheck /> Save
                </button>
              </div>
            )}

            {success && <div className="success-msg">{success}</div>}
            {error && <div className="error-msg">{error}</div>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountDetails;