import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaQrcode, FaSyncAlt, FaCheckCircle, FaExclamationCircle, FaUserCheck } from 'react-icons/fa';
import { verifyAccount } from '../../services/accountAPI';
import './styles/TransferMoney.css';

import { useToast } from '../../context/ToastContext';

const UPITransfer = () => {
    const { showToast } = useToast();
    const [identifier, setIdentifier] = useState(""); // Account No or Username
    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [qrValue, setQrValue] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [generatedVpa, setGeneratedVpa] = useState("");

    // Verification State
    const [verificationStatus, setVerificationStatus] = useState('idle'); // idle | loading | valid | invalid
    const [beneficiaryDetails, setBeneficiaryDetails] = useState(null);

    const handleVerifyAccount = async () => {
        // Verify if it looks like an account number (numeric > 5) OR a username (length > 3)
        const isAccount = /^\d{6,}$/.test(identifier);
        const isUsername = identifier.length > 3;

        if (!isAccount && !isUsername) {
            setVerificationStatus('idle');
            setBeneficiaryDetails(null);
            return;
        }

        setVerificationStatus('loading');
        try {
            const data = await verifyAccount(identifier);
            if (data.valid) {
                setVerificationStatus('valid');
                setBeneficiaryDetails(data);
            } else {
                setVerificationStatus('invalid');
                setBeneficiaryDetails(null);
            }
        } catch (err) {
            setVerificationStatus('invalid');
            setBeneficiaryDetails(null);
        }
    };

    const handleGenerateQR = (e) => {
        e.preventDefault();
        if (!identifier || !amount) {
            showToast("Please enter Account Number/Username and Amount", 'error');
            return;
        }

        if (verificationStatus === 'invalid') {
            showToast("Please enter a valid account number or username", 'error');
            return;
        }

        // Generate VPA based on input type
        // Simple heuristic: If numeric and > 6 digits -> Account, else Username
        const isAccount = /^\d{6,}$/.test(identifier);
        const vpa = isAccount
            ? `acc.${identifier}@bank`
            : `user.${identifier.toLowerCase().replace(/\s+/g, '')}@bank`;

        setGeneratedVpa(vpa);

        // Construct the UPI String
        const upiString = `upi://pay?pa=${vpa}&pn=${identifier}&am=${amount}&cu=INR&tn=${encodeURIComponent(remarks)}`;

        setQrValue(upiString);
        setShowQr(true);
    };

    const handleReset = () => {
        setShowQr(false);
        setQrValue("");
        setIdentifier("");
        setAmount("");
        setRemarks("");
        setGeneratedVpa("");
        setVerificationStatus('idle');
        setBeneficiaryDetails(null);
    };

    return (
        <div className="transfer-content-wrapper">
            <div className="transfer-header">
                <h2>UPI Payment</h2>
                <p>Generate a QR code using Account or Username.</p>
            </div>

            {!showQr ? (
                <form onSubmit={handleGenerateQR} className="transfer-form">
                    <div className="form-group">
                        <label>Receiver Account Number / Username</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value);
                                    if (verificationStatus !== 'idle') setVerificationStatus('idle');
                                }}
                                onBlur={handleVerifyAccount}
                                placeholder="e.g. 123456789 or john_doe"
                                required
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    borderColor: verificationStatus === 'valid' ? '#10B981' :
                                        verificationStatus === 'invalid' ? '#EF4444' : ''
                                }}
                            />
                            {verificationStatus === 'loading' && (
                                <span style={{ position: 'absolute', right: '10px', top: '12px', fontSize: '0.8rem', color: '#64748B' }}>Checking...</span>
                            )}
                        </div>
                        {/* Verification Feedback */}
                        {verificationStatus === 'valid' && beneficiaryDetails && (
                            <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaUserCheck /> Verified: <strong>{beneficiaryDetails.fullName}</strong> (@{beneficiaryDetails.username})
                            </div>
                        )}
                        {verificationStatus === 'invalid' && (
                            <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaExclamationCircle /> Account not found
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Amount (INR)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Remarks (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Payment for..."
                        />
                    </div>

                    <button type="submit" className="action-btn" disabled={verificationStatus === 'invalid'}>
                        <FaQrcode /> Generate QR Code
                    </button>
                </form>
            ) : (
                <div className="upi-container">
                    <div className="qr-display">
                        <div className="qr-box">
                            <QRCodeCanvas value={qrValue} size={200} level={"H"} includeMargin={true} />
                        </div>
                        <div className="upi-details">
                            <p>Paying to:</p>
                            <h3>{generatedVpa}</h3>
                            <p style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: '#0F172A' }}>
                                ₹{Number(amount).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <button className="secondary-btn" onClick={handleReset}>
                            <FaSyncAlt /> Create New QR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UPITransfer;
