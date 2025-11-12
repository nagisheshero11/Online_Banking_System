import React, { useEffect, useState } from 'react';
import './styles/AccountDetails.css';
import { FaUserCircle, FaCalendarAlt, FaInfoCircle, FaChevronRight, FaArrowDown, FaArrowUp, FaEdit, FaCheck } from 'react-icons/fa';
import { getAccountDetails, updateTransactionLimit } from '../../services/accountAPI';

const currency = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'INR' });

const maskAccount = (acc = '') => {
  const s = String(acc);
  const last = s.slice(-4);
  return '********' + last;
};

const AccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState('');

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

  if (!account) return <div>Loading account details...</div>;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="account-details-root">
      <div className="account-summary-card">
        <div className="summary-holder-row">
          <div>
            <div className="summary-label">Account Holder</div>
            <h3>{account.firstName} {account.lastName}</h3>
            <p>{maskAccount(account.accountNumber)}</p>
          </div>
          <div className="summary-icon"><FaUserCircle /></div>
        </div>

        <div className="summary-balance-row">
          <div>
            <div className="summary-label">Current Balance</div>
            <div className="summary-balance-value">{currency(account.balance)}</div>
          </div>
          <div className="summary-type-info">
            <div className="summary-account-type">{account.accountType}</div>
            <div className="summary-sub">Joined {formatDate(account.createdAt)}</div>
          </div>
        </div>
        <FaChevronRight className="balance-chevron" aria-hidden />
      </div>

      {/* Account Info Section */}
      <div className="account-info-details">
        <div className="info-section-title">Account Information</div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon-badge blue"><FaCalendarAlt /></div>
            <div className="info-text">
              <div className="info-label">Opened</div>
              <div className="info-value">{formatDate(account.createdAt)}</div>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-badge green"><FaInfoCircle /></div>
            <div className="info-text">
              <div className="info-label">Account Type</div>
              <div className="info-value">{account.accountType}</div>
            </div>
          </div>

          {/* ✅ Editable Transaction Limit */}
          <div className="info-item editable-limit">
            <div className="info-icon-badge purple">₹</div>
            <div className="info-text">
              <div className="info-label">Transaction Limit</div>
              {isEditing ? (
                <div className="limit-edit-row">
                  <input
                    type="number"
                    value={newLimit}
                    placeholder="Enter new limit"
                    onChange={(e) => setNewLimit(e.target.value)}
                  />
                  <button className="save-limit-btn" onClick={handleLimitUpdate}>
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="limit-display">
                  <div className="info-value balance-value">{currency(account.transactionLimit)}</div>
                  <button className="edit-limit-btn" onClick={() => setIsEditing(true)}>
                    <FaEdit />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-badge orange">#</div>
            <div className="info-text">
              <div className="info-label">IFSC Code</div>
              <div className="info-value">{account.ifscCode}</div>
            </div>
          </div>
        </div>

        {success && <div className="success-msg">{success}</div>}
        {error && <div className="error-msg">{error}</div>}
      </div>
    </div>
  );
};

export default AccountDetails;