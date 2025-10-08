// client/src/components/PayBills/PayBills.js

import React, { useState } from 'react';
import { FaBolt, FaWifi, FaFire, FaMobileAlt, FaRupeeSign, FaExclamationCircle } from 'react-icons/fa'; 
import './styles/PayBills.css';

// Helper function for currency formatting (using INR)
const currency = (n) =>
    n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });

// Data for the Bill Type Selector, now including a specific 'color' for each
const billTypes = [
    { id: 'electricity', label: 'Electricity Bill', icon: FaBolt, color: '#ffc107' }, // Yellow/Amber
    { id: 'internet', label: 'Internet Bill', icon: FaWifi, color: '#00d4ff' },       // Cyan/Blue
    { id: 'gas', label: 'Gas Bill', icon: FaFire, color: '#fd7e14' },              // Orange
    { id: 'mobile', label: 'Mobile Recharge', icon: FaMobileAlt, color: '#28a745' }, // Green
];

const PayBills = ({ currentBalance = 45750.50 }) => {
    const [selectedBill, setSelectedBill] = useState(null); 
    const [formData, setFormData] = useState({ 
        accountNumber: '',
        billAmount: ''
    });
    const [showValidationMessage, setShowValidationMessage] = useState(false); 

    // Find the full object of the currently selected bill
    const activeBill = billTypes.find(b => b.id === selectedBill);

    const handleBillSelect = (id) => {
        setSelectedBill(id);
        setFormData({ accountNumber: '', billAmount: '' });
        setShowValidationMessage(false);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setShowValidationMessage(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        // Client-side validation
        if (!formData.accountNumber.trim() || !formData.billAmount.trim() || !activeBill) {
            setShowValidationMessage(true); 
            return;
        }
        setShowValidationMessage(false); 
        console.log('Paying bill:', activeBill.label, formData);
        alert(`Attempting to pay ${currency(parseFloat(formData.billAmount))} for ${activeBill.label}`);
        // In a real app, you would submit data to the backend here
    };

    return (
        <div className="pay-bills-page">
            
            {/* Page Header (WITH NEW WRAPPER FOR CENTERING) */}
            <div className="page-header-wrapper">
                <div className="page-header">
                    <h1 className="header-title">Pay Bills</h1>
                    <p className="header-subtitle">Pay your utility bills quickly and securely</p>
                </div>
            </div>

            {/* 1. Bill Type Selector Card (WITH WRAPPER FOR CENTERING) */}
            <div className="bill-selector-container"> 
                <div className="bill-selector-card card">
                    <h3 className="selector-title">Select Bill Type</h3>
                    <div className="bill-type-grid">
                        {billTypes.map(bill => (
                            <div 
                                key={bill.id} 
                                className={`bill-type-tile ${selectedBill === bill.id ? 'active' : ''}`}
                                onClick={() => handleBillSelect(bill.id)}
                                // DYNAMIC BORDER COLOR for active state
                                style={selectedBill === bill.id ? { borderColor: bill.color } : {}}
                            >
                                <span className="tile-icon-wrap" style={{ backgroundColor: bill.color }}>
                                    <bill.icon className="tile-icon" />
                                </span>
                                <span className="tile-label">{bill.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Payment Form Card (CONDITIONAL RENDERING) */}
            {activeBill && (
                <div className="payment-form-card card">
                    {/* Dynamic Header Banner */}
                    <div 
                        className="form-header-banner" 
                        style={{ background: `linear-gradient(90deg, ${activeBill.color}, ${activeBill.color}d0)` }}
                    >
                        <activeBill.icon /> 
                        <span className="bill-name">{activeBill.label}</span>
                        <span className="balance-info">Available Balance: {currency(currentBalance)}</span>
                    </div>

                    <form className="bill-payment-form" onSubmit={handleSubmit}>
                        
                        {/* Validation Message (Conditional) */}
                        {showValidationMessage && (
                            <div className="validation-message">
                                <FaExclamationCircle className="validation-icon" />
                                <span>Please fill in all required fields</span>
                            </div>
                        )}
                        
                        {/* Account / Consumer Number Input */}
                        <label htmlFor="accountNumber" className="form-label">Account / Consumer Number *</label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                id="accountNumber"
                                name="accountNumber"
                                className="form-input"
                                value={formData.accountNumber}
                                onChange={handleFormChange}
                                placeholder="Enter your account/consumer number" 
                                required 
                            />
                        </div>

                        {/* Bill Amount Input */}
                        <label htmlFor="billAmount" className="form-label">Bill Amount *</label>
                        <div className="input-group">
                            <span className="input-icon"><FaRupeeSign /></span>
                            <input 
                                type="number" 
                                id="billAmount"
                                name="billAmount"
                                className="form-input"
                                value={formData.billAmount}
                                onChange={handleFormChange}
                                placeholder="Enter bill amount" 
                                required 
                            />
                        </div>

                        {/* Payment Summary */}
                        <div 
                            className="payment-summary"
                            style={{ 
                                backgroundColor: `${activeBill.color}15`, // Light tint of the color
                                borderColor: `${activeBill.color}50` // Transparent border of the color
                            }}
                        >
                            <h4 
                                className="summary-title-text"
                                style={{ color: activeBill.color }} 
                            >
                                Payment Summary
                            </h4>
                            <p className="summary-line">
                                <span className="summary-label">Bill Type:</span> 
                                <span className="summary-value">{activeBill.label}</span>
                            </p>
                            <p className="summary-line">
                                <span className="summary-label">Account:</span> 
                                <span className="summary-value">{formData.accountNumber || 'Not entered'}</span>
                            </p>
                            <p className="summary-line">
                                <span className="summary-label">Amount:</span> 
                                <span className="summary-value">
                                    {formData.billAmount ? currency(parseFloat(formData.billAmount)) : '₹0.00'}
                                </span>
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-pay"
                                disabled={!formData.accountNumber.trim() || !formData.billAmount.trim()} 
                                style={{ background: activeBill.color }}
                            >
                                Pay Bill
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleBillSelect(null)} 
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PayBills;