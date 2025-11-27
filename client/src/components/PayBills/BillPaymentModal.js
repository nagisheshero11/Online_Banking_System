import React, { useState, useEffect } from "react";
import { FaCreditCard, FaUniversity, FaCheckCircle, FaTimes, FaQrcode } from "react-icons/fa";
import { QRCodeCanvas } from 'qrcode.react';
import { getMyCards } from "../../services/cardAPI";
import { payBill, payBillWithCard } from "../../services/billsAPI";
import "./styles/PayBills.css"; // Reuse existing styles

const BillPaymentModal = ({ bill, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState("ACCOUNT"); // ACCOUNT | CARD
    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (paymentMethod === "CARD") {
            fetchCards();
        }
    }, [paymentMethod]);

    const fetchCards = async () => {
        try {
            const data = await getMyCards();
            // Filter only ACTIVE cards
            const activeCards = (data || []).filter(c => c.status === "ACTIVE");
            setCards(activeCards);
            if (activeCards.length > 0) {
                setSelectedCardId(activeCards[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch cards", err);
            setError("Failed to load cards");
        }
    };

    const handlePayment = async () => {
        if (paymentMethod === "UPI") {
            onClose();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (paymentMethod === "ACCOUNT") {
                await payBill(bill.id);
            } else if (paymentMethod === "CARD") {
                if (!selectedCardId) throw new Error("Please select a card");
                if (!pin) throw new Error("Please enter your PIN");
                await payBillWithCard(bill.id, selectedCardId, pin);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    // Generate UPI String for QR Code
    // Format: upi://pay?pa={billerVPA}&pn={billerName}&am={amount}&tn={billId}
    const billerVPA = `biller.${bill.billType.toLowerCase()}@bank`;
    const upiString = `upi://pay?pa=${billerVPA}&pn=OnlineBanking&am=${bill.amount}&tn=Bill-${bill.id}&cu=INR`;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Payment Summary</h3>
                    <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: '#64748B' }} />
                </div>

                {/* Bill Details */}
                <div className="summary-row">
                    <span>Bill Type:</span>
                    <strong>{bill.billType.replace('_', ' ')}</strong>
                </div>
                <div className="summary-row">
                    <span>Due Date:</span>
                    <strong>{bill.dueDate}</strong>
                </div>
                <div className="summary-row total">
                    <span>Total Amount:</span>
                    <strong>{currency(bill.amount)}</strong>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #E2E8F0' }} />

                {/* Payment Method Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#475569' }}>Select Payment Method</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className={`method-btn ${paymentMethod === "ACCOUNT" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("ACCOUNT")}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: paymentMethod === "ACCOUNT" ? '2px solid #2563EB' : '1px solid #CBD5E1',
                                borderRadius: '8px',
                                background: paymentMethod === "ACCOUNT" ? '#EFF6FF' : 'white',
                                color: paymentMethod === "ACCOUNT" ? '#1E40AF' : '#64748B',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}
                        >
                            <FaUniversity /> Account
                        </button>
                        <button
                            className={`method-btn ${paymentMethod === "CARD" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("CARD")}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: paymentMethod === "CARD" ? '2px solid #2563EB' : '1px solid #CBD5E1',
                                borderRadius: '8px',
                                background: paymentMethod === "CARD" ? '#EFF6FF' : 'white',
                                color: paymentMethod === "CARD" ? '#1E40AF' : '#64748B',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}
                        >
                            <FaCreditCard /> Card
                        </button>
                        <button
                            className={`method-btn ${paymentMethod === "UPI" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("UPI")}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: paymentMethod === "UPI" ? '2px solid #2563EB' : '1px solid #CBD5E1',
                                borderRadius: '8px',
                                background: paymentMethod === "UPI" ? '#EFF6FF' : 'white',
                                color: paymentMethod === "UPI" ? '#1E40AF' : '#64748B',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}
                        >
                            <FaQrcode /> UPI
                        </button>
                    </div>
                </div>

                {/* Card Selection & PIN */}
                {paymentMethod === "CARD" && (
                    <div className="card-payment-form" style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#64748B' }}>Select Card</label>
                            <select
                                value={selectedCardId}
                                onChange={(e) => setSelectedCardId(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                            >
                                {cards.map(card => (
                                    <option key={card.id} value={card.id}>
                                        {card.cardType.replace('_', ' ')} - {card.cardNumber.slice(-4)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#64748B' }}>Enter PIN</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="****"
                                maxLength="4"
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                            />
                        </div>
                    </div>
                )}

                {/* UPI QR Code Display */}
                {paymentMethod === "UPI" && (
                    <div className="upi-payment-section" style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', background: '#F8FAFC', borderRadius: '12px' }}>
                        <p style={{ marginBottom: '15px', color: '#64748B' }}>Scan to Pay</p>
                        <div style={{ background: 'white', padding: '15px', display: 'inline-block', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            <QRCodeCanvas value={upiString} size={180} level={"H"} />
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <small style={{ display: 'block', color: '#64748B' }}>Paying to</small>
                            <strong style={{ color: '#0F172A' }}>{billerVPA}</strong>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ color: '#EF4444', background: '#FEF2F2', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
                    <button
                        className="confirm-btn"
                        onClick={handlePayment}
                        disabled={loading}
                        style={{ background: loading ? '#94A3B8' : '#0F172A' }}
                    >
                        {loading ? "Processing..." : (paymentMethod === "UPI" ? "Close" : `Pay ${currency(bill.amount)}`)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillPaymentModal;
