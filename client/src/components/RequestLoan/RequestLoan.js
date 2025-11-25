import React, { useState, useEffect } from 'react';
import { FaHome, FaGraduationCap, FaCar, FaBriefcase, FaUser, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import './styles/RequestLoan.css';
import { applyForLoan } from '../../services/loanAPI';

const RequestLoan = () => {
    // State
    const [loanType, setLoanType] = useState('');
    const [loanAmount, setLoanAmount] = useState(50000);
    const [loanTenure, setLoanTenure] = useState(12);
    const [loading, setLoading] = useState(false);
    const [successMode, setSuccessMode] = useState(false);

    // Constants
    const MIN_AMOUNT = 10000;
    const MAX_AMOUNT = 5000000;
    const MIN_TENURE = 6;
    const MAX_TENURE = 60;

    const loanTypes = [
        { id: 'PERSONAL', label: 'Personal Loan', icon: <FaUser />, rate: 9.5, maxAmount: 1000000 },
        { id: 'HOME', label: 'Home Loan', icon: <FaHome />, rate: 8.2, maxAmount: 5000000 },
        { id: 'EDUCATION', label: 'Education Loan', icon: <FaGraduationCap />, rate: 7.8, maxAmount: 2000000 },
        { id: 'VEHICLE', label: 'Vehicle Loan', icon: <FaCar />, rate: 8.6, maxAmount: 1500000 },
        { id: 'BUSINESS', label: 'Business Loan', icon: <FaBriefcase />, rate: 10.0, maxAmount: 5000000 }
    ];

    // Derived State
    const selectedLoanDetails = loanTypes.find(t => t.id === loanType);
    const baseRate = selectedLoanDetails ? selectedLoanDetails.rate : 0;

    // Interest Calculation Logic
    const calculateEffectiveRate = () => {
        if (!baseRate) return 0;
        let rate = baseRate;
        if (loanAmount >= 500000) rate -= 0.3;
        if (loanTenure >= 48) rate += 0.5;
        return parseFloat(rate.toFixed(2));
    };

    const effectiveRate = calculateEffectiveRate();

    const calculateEMI = () => {
        if (!loanAmount || !effectiveRate || !loanTenure) return 0;
        const r = effectiveRate / (12 * 100);
        const emi = (loanAmount * r * Math.pow(1 + r, loanTenure)) / (Math.pow(1 + r, loanTenure) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI();
    const totalPayable = emi * loanTenure;
    const totalInterest = totalPayable - loanAmount;

    // Handlers
    const handleTypeSelect = (id) => {
        setLoanType(id);
        // Reset amount if it exceeds new max
        const type = loanTypes.find(t => t.id === id);
        if (type && loanAmount > type.maxAmount) {
            setLoanAmount(type.maxAmount);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loanType) return alert('Please select a loan type');

        setLoading(true);
        try {
            await applyForLoan({
                loanType,
                loanAmount,
                tenureMonths: loanTenure,
                interestRate: effectiveRate
            });
            setSuccessMode(true);
            setTimeout(() => {
                setSuccessMode(false);
                setLoanType('');
                setLoanAmount(50000);
                setLoanTenure(12);
            }, 3000);
        } catch (err) {
            alert(err.message || "Loan submission failed.");
        } finally {
            setLoading(false);
        }
    };

    // Formatters
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="zen-loan-container">
            <div className="zen-loan-header">
                <h1>Request a Loan</h1>
                <p>Choose the perfect plan for your financial goals.</p>
            </div>

            <div className="zen-loan-layout">
                {/* LEFT COLUMN: Controls */}
                <div className="zen-loan-controls">

                    {/* 1. Loan Type Selection */}
                    <section className="control-section">
                        <label className="section-title">Select Loan Type</label>
                        <div className="loan-type-grid">
                            {loanTypes.map(type => (
                                <div
                                    key={type.id}
                                    className={`loan-type-card ${loanType === type.id ? 'selected' : ''}`}
                                    onClick={() => handleTypeSelect(type.id)}
                                >
                                    <div className="type-icon">{type.icon}</div>
                                    <span className="type-label">{type.label}</span>
                                    <span className="type-rate">{type.rate}%</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. Loan Amount Slider */}
                    <section className="control-section">
                        <div className="slider-header">
                            <label className="section-title">Loan Amount</label>
                            <span className="slider-value">{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="range-slider-container">
                            <input
                                type="range"
                                min={MIN_AMOUNT}
                                max={selectedLoanDetails ? selectedLoanDetails.maxAmount : MAX_AMOUNT}
                                step={5000}
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="zen-range"
                                style={{ backgroundSize: `${((loanAmount - MIN_AMOUNT) * 100) / ((selectedLoanDetails ? selectedLoanDetails.maxAmount : MAX_AMOUNT) - MIN_AMOUNT)}% 100%` }}
                            />
                            <div className="slider-labels">
                                <span>{formatCurrency(MIN_AMOUNT)}</span>
                                <span>{formatCurrency(selectedLoanDetails ? selectedLoanDetails.maxAmount : MAX_AMOUNT)}</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Tenure Slider */}
                    <section className="control-section">
                        <div className="slider-header">
                            <label className="section-title">Tenure (Months)</label>
                            <span className="slider-value">{loanTenure} Months</span>
                        </div>
                        <div className="range-slider-container">
                            <input
                                type="range"
                                min={MIN_TENURE}
                                max={MAX_TENURE}
                                step={6}
                                value={loanTenure}
                                onChange={(e) => setLoanTenure(Number(e.target.value))}
                                className="zen-range"
                                style={{ backgroundSize: `${((loanTenure - MIN_TENURE) * 100) / (MAX_TENURE - MIN_TENURE)}% 100%` }}
                            />
                            <div className="slider-labels">
                                <span>{MIN_TENURE} Mo</span>
                                <span>{MAX_TENURE} Mo</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Real-time Dashboard */}
                <div className="zen-loan-dashboard">
                    <div className="dashboard-card">
                        <h3>EMI Summary</h3>

                        <div className="emi-display">
                            <span className="emi-label">Monthly EMI</span>
                            <span className="emi-amount">{formatCurrency(emi)}</span>
                        </div>

                        <div className="dashboard-divider"></div>

                        <div className="summary-row">
                            <span>Interest Rate</span>
                            <span>{effectiveRate}% p.a.</span>
                        </div>
                        <div className="summary-row">
                            <span>Principal Amount</span>
                            <span>{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Total Interest</span>
                            <span>{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Payable</span>
                            <span>{formatCurrency(totalPayable)}</span>
                        </div>

                        <button
                            className={`zen-submit-btn ${successMode ? 'success' : ''}`}
                            onClick={handleSubmit}
                            disabled={loading || !loanType}
                        >
                            {successMode ? (
                                <>
                                    <FaCheckCircle /> Request Sent
                                </>
                            ) : (
                                loading ? 'Processing...' : 'Submit Request'
                            )}
                        </button>

                        {!loanType && <p className="select-hint"><FaInfoCircle /> Select a loan type to proceed</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestLoan;