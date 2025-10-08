import React, { useState } from 'react';
import { FaPaperPlane, FaUser } from 'react-icons/fa';
import './styles/TransferMoney.css';

const TransferMoney = () => {
    const [receiverAccount, setReceiverAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [description, setDescription] = useState('');

    const userAccount = 'BANK10012345';
    const availableBalance = 45750.50;

    const handleTransfer = (e) => {
        e.preventDefault();

        // Validation
        if (!receiverAccount) {
            alert('Please enter receiver\'s account number');
            return;
        }

        if (!transferAmount || parseFloat(transferAmount) <= 0) {
            alert('Please enter a valid transfer amount');
            return;
        }

        if (parseFloat(transferAmount) > availableBalance) {
            alert('Insufficient balance for this transfer');
            return;
        }

        if (receiverAccount === userAccount) {
            alert('Cannot transfer to the same account');
            return;
        }

        // Here you would typically make an API call to process the transfer
        alert(`Transfer of ₹${parseFloat(transferAmount).toLocaleString()} to ${receiverAccount} processed successfully!`);

        // Reset form
        setReceiverAccount('');
        setTransferAmount('');
        setDescription('');
    };

    const handleCancel = () => {
        setReceiverAccount('');
        setTransferAmount('');
        setDescription('');
    };

    return (
        <div className="transfer-money-container">
            {/* Header Section */}
            <div className="transfer-header">
                {/* <h2>Transfer Money</h2> */}
                <p>Send money to any account instantly</p>
            </div>

            {/* Transfer Card */}
            <div className="transfer-card">
                {/* Banner Section */}
                <div className="transfer-banner">
                    <div className="banner-content">
                        <FaPaperPlane className="transfer-icon" />
                        <div className="banner-text">
                            <h3>Transfer Funds</h3>
                            <p>Available Balance: ₹{availableBalance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleTransfer} className="transfer-form">
                    {/* Receiver Account Input */}
                    <div className="form-group">
                        <label htmlFor="receiverAccount" className="form-label">
                            Receiver Account Number *
                        </label>
                        <div className="account-input-container">
                            <FaUser className="account-icon" />
                            <input
                                type="text"
                                id="receiverAccount"
                                value={receiverAccount}
                                onChange={(e) => setReceiverAccount(e.target.value)}
                                placeholder="Enter receiver's account number"
                                className="account-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Transfer Amount Input */}
                    <div className="form-group">
                        <label htmlFor="transferAmount" className="form-label">
                            Transfer Amount *
                        </label>
                        <div className="amount-input-container">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                id="transferAmount"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="Enter amount to transfer"
                                className="amount-input"
                                min="1"
                                max={availableBalance}
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description / Remarks (Optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a note for this transfer"
                            className="description-input"
                            rows="3"
                        />
                    </div>

                    {/* Transfer Details Summary */}
                    <div className="transfer-details">
                        <h4>Transfer Details:</h4>
                        <div className="details-row">
                            <span className="detail-label">From:</span>
                            <span className="detail-value">{userAccount}</span>
                        </div>
                        <div className="details-row">
                            <span className="detail-label">To:</span>
                            <span className="detail-value">{receiverAccount || 'Not entered'}</span>
                        </div>
                        <div className="details-row">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value">₹{transferAmount ? parseFloat(transferAmount).toLocaleString() : '0.00'}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="transfer-btn">
                            Transfer Now
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferMoney;