import React, { useState } from 'react';
import { FaSuitcase, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import './styles/RequestLoan.css';

const RequestLoan = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState('');
    const [loanTenure, setLoanTenure] = useState('');
    const [loanPurpose, setLoanPurpose] = useState('');

    const quickAmounts = [50000, 100000, 200000, 500000];
    const tenureOptions = [
        { value: '6', label: '6 months' },
        { value: '12', label: '12 months' },
        { value: '18', label: '18 months' },
        { value: '24', label: '24 months' },
        { value: '36', label: '36 months' },
        { value: '48', label: '48 months' },
        { value: '60', label: '60 months' }
    ];

    const handleQuickAmountSelect = (amount) => {
        setLoanAmount(amount.toString());
        setSelectedQuickAmount(amount);
    };

    const handleAmountChange = (e) => {
        setLoanAmount(e.target.value);
        setSelectedQuickAmount(''); // Clear quick amount selection when manually typing
    };

    const calculateInterestRate = (amount, tenure) => {
        // Simple interest rate calculation based on amount and tenure
        let baseRate = 8.5;
        if (amount >= 500000) baseRate = 8.0;
        else if (amount >= 200000) baseRate = 8.2;
        else if (amount >= 100000) baseRate = 8.5;
        else baseRate = 9.0;

        if (tenure >= 48) baseRate += 0.5;
        else if (tenure >= 24) baseRate += 0.2;

        return baseRate.toFixed(1);
    };

    const calculateEMI = (principal, rate, tenure) => {
        const monthlyRate = rate / (12 * 100);
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1);
        return emi;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!loanAmount || parseFloat(loanAmount) <= 0) {
            alert('Please enter a valid loan amount');
            return;
        }

        if (!loanTenure) {
            alert('Please select loan tenure');
            return;
        }

        if (!loanPurpose.trim()) {
            alert('Please describe the purpose of the loan');
            return;
        }

        // Here you would typically make an API call to submit the loan application
        alert(`Loan application for ₹${parseFloat(loanAmount).toLocaleString()} submitted successfully! You will receive confirmation within 2-3 business days.`);

        // Reset form
        setLoanAmount('');
        setSelectedQuickAmount('');
        setLoanTenure('');
        setLoanPurpose('');
    };

    const handleCancel = () => {
        setLoanAmount('');
        setSelectedQuickAmount('');
        setLoanTenure('');
        setLoanPurpose('');
    };

    const interestRate = loanAmount && loanTenure ? calculateInterestRate(parseFloat(loanAmount), parseInt(loanTenure)) : '8.5';
    const emi = loanAmount && loanTenure ? calculateEMI(parseFloat(loanAmount), parseFloat(interestRate), parseInt(loanTenure)) : 0;

    return (
        <div className="request-loan-container">
            {/* Header Section */}
            <div className="loan-header">
                {/* <h2>Request Loan</h2> */}
                <p>Apply for a loan with competitive interest rates</p>
            </div>

            {/* Loan Card */}
            <div className="loan-card">
                {/* Banner Section */}
                <div className="loan-banner">
                    <div className="banner-content">
                        <FaSuitcase className="loan-icon" />
                        <div className="banner-text">
                            <h3>Loan Application</h3>
                            <p>Interest Rate: Starting from {interestRate}% p.a.</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="loan-form">
                    {/* Loan Amount Input */}
                    <div className="form-group">
                        <label htmlFor="loanAmount" className="form-label">
                            Loan Amount *
                        </label>
                        <div className="amount-input-container">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                id="loanAmount"
                                value={loanAmount}
                                onChange={handleAmountChange}
                                placeholder="Enter loan amount"
                                className="amount-input"
                                min="10000"
                                max="10000000"
                                step="1000"
                                required
                            />
                        </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="quick-amounts-section">
                        <label className="section-label">Quick Loan Amounts</label>
                        <div className="quick-amounts-grid">
                            {quickAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => handleQuickAmountSelect(amount)}
                                    className={`quick-amount-btn ${selectedQuickAmount === amount ? 'selected' : ''
                                        }`}
                                >
                                    ₹{(amount / 1000)}K
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loan Tenure Selection */}
                    <div className="form-group">
                        <label htmlFor="loanTenure" className="form-label">
                            Loan Tenure *
                        </label>
                        <div className="tenure-input-container">
                            <FaCalendarAlt className="tenure-icon" />
                            <select
                                id="loanTenure"
                                value={loanTenure}
                                onChange={(e) => setLoanTenure(e.target.value)}
                                className="tenure-select"
                                required
                            >
                                <option value="">Select loan tenure</option>
                                {tenureOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Purpose of Loan */}
                    <div className="form-group">
                        <label htmlFor="loanPurpose" className="form-label">
                            Purpose of Loan *
                        </label>
                        <div className="purpose-input-container">
                            <FaFileAlt className="purpose-icon" />
                            <textarea
                                id="loanPurpose"
                                value={loanPurpose}
                                onChange={(e) => setLoanPurpose(e.target.value)}
                                placeholder="Describe the purpose of your loan"
                                className="purpose-input"
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    {/* Loan Details Summary */}
                    {loanAmount && loanTenure && (
                        <div className="loan-details">
                            <h4>Loan Details:</h4>
                            <div className="details-row">
                                <span className="detail-label">Loan Amount:</span>
                                <span className="detail-value">₹{parseFloat(loanAmount).toLocaleString()}</span>
                            </div>
                            <div className="details-row">
                                <span className="detail-label">Interest Rate:</span>
                                <span className="detail-value">{interestRate}% p.a.</span>
                            </div>
                            <div className="details-row">
                                <span className="detail-label">Tenure:</span>
                                <span className="detail-value">{loanTenure} months</span>
                            </div>
                            <div className="details-row">
                                <span className="detail-label">Monthly EMI:</span>
                                <span className="detail-value">₹{Math.round(emi).toLocaleString()}</span>
                            </div>
                            <div className="details-row">
                                <span className="detail-label">Total Amount:</span>
                                <span className="detail-value">₹{Math.round(emi * parseInt(loanTenure)).toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="loan-btn">
                            Apply for Loan
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

export default RequestLoan;