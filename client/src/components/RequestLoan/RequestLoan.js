import React, { useState } from 'react';
import { FaSuitcase, FaCalendarAlt } from 'react-icons/fa';
import './styles/RequestLoan.css';
import { applyForLoan } from '../../services/loanAPI';

const RequestLoan = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
    const [loanTenure, setLoanTenure] = useState('');
    const [loanType, setLoanType] = useState('');
    const [loading, setLoading] = useState(false);

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

    const loanTypeOptions = [
        { value: 'PERSONAL', label: 'Personal Loan' },
        { value: 'HOME', label: 'Home Loan' },
        { value: 'EDUCATION', label: 'Education Loan' },
        { value: 'VEHICLE', label: 'Vehicle Loan' },
        { value: 'BUSINESS', label: 'Business Loan' }
    ];

    /* ---------------------- Quick Amount Logic ---------------------- */
    const handleQuickAmountSelect = (amount) => {
        setSelectedQuickAmount(amount);
        setLoanAmount(String(amount));
    };

    const handleAmountChange = (e) => {
        setLoanAmount(e.target.value);
        setSelectedQuickAmount(null);
    };

    /* ---------------------- Interest Rate Logic ---------------------- */
    const baseInterestRates = {
        PERSONAL: 9.5,
        HOME: 8.2,
        EDUCATION: 7.8,
        VEHICLE: 8.6,
        BUSINESS: 10.0
    };

    const calculateInterestRate = () => {
        if (!loanType || !loanAmount || !loanTenure) return "0.0";

        let rate = baseInterestRates[loanType];

        const amount = parseFloat(loanAmount);
        const tenure = parseInt(loanTenure);

        if (amount >= 500000) rate -= 0.3;
        else if (amount >= 200000) rate -= 0.1;

        if (tenure >= 48) rate += 0.5;
        else if (tenure >= 24) rate += 0.2;

        return rate.toFixed(1);
    };

    const calculateEMI = (principal, rate, tenure) => {
        const monthlyRate = rate / (12 * 100);
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1);
    };

    const interestRate = calculateInterestRate();
    const emi =
        loanAmount && loanTenure
            ? calculateEMI(parseFloat(loanAmount), parseFloat(interestRate), parseInt(loanTenure))
            : 0;

    /* ---------------------- Form Submit ---------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loanType) return alert('Please select a loan type');
        if (!loanAmount || loanAmount <= 0) return alert('Please enter a valid loan amount');
        if (!loanTenure) return alert('Please select loan tenure');

        setLoading(true);

        const loanPayload = {
            loanType,
            loanAmount: parseFloat(loanAmount),
            tenureMonths: parseInt(loanTenure),
            interestRate: parseFloat(interestRate)
        };

        try {
            await applyForLoan(loanPayload);
            alert("Loan Request Submitted Successfully!");

            setLoanAmount('');
            setLoanTenure('');
            setLoanType('');
            setSelectedQuickAmount(null);

        } catch (err) {
            alert(err.message || "Loan submission failed.");
        }

        setLoading(false);
    };

    return (
        <div className="request-loan-container">
            {/* Header */}
            <div className="loan-header">
                <p>Apply for a loan with competitive interest rates</p>
            </div>

            <div className="loan-card">
                {/* Banner */}
                <div className="loan-banner">
                    <div className="banner-content">
                        <FaSuitcase className="loan-icon" />
                        <div className="banner-text">
                            <h3>Loan Application</h3>
                            <p>Interest Rate: {interestRate}% p.a.</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="loan-form">

                    {/* Loan Type */}
                    <div className="form-group">
                        <label className="form-label">Loan Type *</label>
                        <select
                            value={loanType}
                            onChange={(e) => setLoanType(e.target.value)}
                            className="tenure-select"
                            required
                        >
                            <option value="">Select loan type</option>
                            {loanTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Loan Amount */}
                    <div className="form-group">
                        <label className="form-label">Loan Amount *</label>
                        <div className="amount-input-container">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
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

                    {/* Quick Amounts */}
                    <div className="quick-amounts-section">
                        <label className="section-label">Quick Loan Amounts</label>
                        <div className="quick-amounts-grid">
                            {quickAmounts.map(amount => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => handleQuickAmountSelect(amount)}
                                    className={`quick-amount-btn ${selectedQuickAmount === amount ? 'selected' : ''}`}
                                >
                                    ₹{amount / 1000}K
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tenure */}
                    <div className="form-group">
                        <label className="form-label">Loan Tenure *</label>
                        <div className="tenure-input-container">
                            <FaCalendarAlt className="tenure-icon" />
                            <select
                                value={loanTenure}
                                onChange={(e) => setLoanTenure(e.target.value)}
                                className="tenure-select"
                                required
                            >
                                <option value="">Select tenure</option>
                                {tenureOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Summary */}
                    {loanAmount && loanTenure && loanType && (
                        <div className="loan-details">
                            <h4>Loan Details:</h4>

                            <div className="details-row"><span>Loan Type:</span><span>{loanType}</span></div>
                            <div className="details-row"><span>Loan Amount:</span><span>₹{parseFloat(loanAmount).toLocaleString()}</span></div>
                            <div className="details-row"><span>Interest Rate:</span><span>{interestRate}% p.a.</span></div>
                            <div className="details-row"><span>Tenure:</span><span>{loanTenure} months</span></div>
                            <div className="details-row"><span>Monthly EMI:</span><span>₹{Math.round(emi).toLocaleString()}</span></div>
                            <div className="details-row"><span>Total Payable:</span><span>₹{Math.round(emi * loanTenure).toLocaleString()}</span></div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="form-actions">
                        <button type="submit" className="loan-btn" disabled={loading}>
                            {loading ? "Submitting..." : "Apply for Loan"}
                        </button>

                        <button type="button" onClick={() => window.location.reload()} className="cancel-btn">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RequestLoan;