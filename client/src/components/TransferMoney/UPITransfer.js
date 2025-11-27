import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaQrcode, FaSyncAlt } from 'react-icons/fa';
import './styles/TransferMoney.css';

const UPITransfer = () => {
    const [identifier, setIdentifier] = useState(""); // Account No or Username
    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [qrValue, setQrValue] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [generatedVpa, setGeneratedVpa] = useState("");

    const handleGenerateQR = (e) => {
        e.preventDefault();
        if (!identifier || !amount) {
            alert("Please enter Account Number/Username and Amount");
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
                        <input
                            type="text"
                            className="form-input"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g. 123456789 or john_doe"
                            required
                        />
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

                    <button type="submit" className="action-btn">
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
