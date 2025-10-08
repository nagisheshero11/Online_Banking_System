import React, { useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import './styles/DepositMoney.css';

const DepositMoney = () => {
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState('');

    const quickAmounts = [500, 1000, 5000, 10000];

    const handleQuickAmountSelect = (amount) => {
        setDepositAmount(amount.toString());
        setSelectedQuickAmount(amount);
    };

    const handleAmountChange = (e) => {
        setDepositAmount(e.target.value);
        setSelectedQuickAmount(''); // Clear quick amount selection when manually typing
    };

    const handleDeposit = (e) => {
        e.preventDefault();
        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        // Here you would typically make an API call to process the deposit
        alert(`Deposit of ₹${parseFloat(depositAmount).toLocaleString()} processed successfully!`);

        // Reset form
        setDepositAmount('');
        setSelectedQuickAmount('');
    };

    const handleCancel = () => {
        setDepositAmount('');
        setSelectedQuickAmount('');
    };

    return (
        <div className="deposit-money-container">
            {/* Header Section */}
            <div className="deposit-header">
                <h2>Deposit Money</h2>
                <p>Add funds to your account</p>
            </div>

            {/* Deposit Card */}
            <div className="deposit-card">
                {/* Banner Section */}
                <div className="deposit-banner">
                    <div className="banner-content">
                        <FaArrowDown className="deposit-icon" />
                        <div className="banner-text">
                            <h3>Deposit Funds</h3>
                            <p>Current Balance: ₹45,750.50</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleDeposit} className="deposit-form">
                    {/* Deposit Amount Input */}
                    <div className="form-group">
                        <label htmlFor="depositAmount" className="form-label">
                            Deposit Amount
                        </label>
                        <div className="amount-input-container">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                id="depositAmount"
                                value={depositAmount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount to deposit"
                                className="amount-input"
                                min="1"
                                max="100000"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="quick-amounts-section">
                        <label className="section-label">Quick Amounts</label>
                        <div className="quick-amounts-grid">
                            {quickAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => handleQuickAmountSelect(amount)}
                                    className={`quick-amount-btn ${selectedQuickAmount === amount ? 'selected' : ''
                                        }`}
                                >
                                    ₹{amount.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Information Note */}
                    <div className="info-note">
                        <h4>Note:</h4>
                        <ul>
                            <li>Instant deposit to your account</li>
                            <li>Maximum deposit limit: ₹1,00,000 per transaction</li>
                            <li>This is a simulation for demonstration purposes</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="deposit-btn">
                            Deposit Now
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

export default DepositMoney;