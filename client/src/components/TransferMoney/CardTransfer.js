import React, { useState, useEffect } from 'react';
import { getMyCards, sendCardPayment } from '../../services/cardAPI';
import { FaCreditCard, FaPaperPlane, FaUser, FaRupeeSign, FaTimes } from 'react-icons/fa';
import './styles/TransferMoney.css';

const CardTransfer = () => {
    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [pin, setPin] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const data = await getMyCards();
            // Filter Active Cards (Credit & Debit)
            const validCards = data.filter(c =>
                c.status?.toUpperCase() === 'ACTIVE' &&
                (c.cardType?.toUpperCase().includes('CREDIT') || c.cardType?.toUpperCase().includes('DEBIT'))
            );
            setCards(validCards);

            if (validCards.length > 0) {
                setSelectedCardId(validCards[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch cards", err);
            setMessage({ type: 'error', text: 'Failed to load cards.' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);

        if (!selectedCardId) {
            setMessage({ type: 'error', text: 'Please select a valid card.' });
            return;
        }
        setShowPinModal(true);
    };

    const handlePinSubmit = async () => {
        if (!pin || pin.length !== 4) {
            setMessage({ type: 'error', text: 'Please enter a valid 4-digit PIN.' });
            return;
        }

        setLoading(true);
        setShowPinModal(false);

        try {
            await sendCardPayment({
                cardId: selectedCardId,
                toAccount,
                amount,
                remarks,
                pin
            });
            setMessage({ type: 'success', text: 'Payment Successful!' });
            setAmount('');
            setToAccount('');
            setRemarks('');
            setPin('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data || 'Payment Failed' });
        }
        setLoading(false);
    };

    return (
        <div className="transfer-content-wrapper">
            <div className="transfer-header">
                <h2>Card Payment</h2>
                <p>Pay using your Credit or Debit Card.</p>
            </div>

            {message && (
                <div className={`message-box ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="transfer-form">
                <div className="form-group">
                    <label>Select Card</label>
                    <select
                        value={selectedCardId}
                        onChange={(e) => setSelectedCardId(e.target.value)}
                        className="form-select"
                    >
                        {cards.length === 0 && <option>No Active Cards</option>}
                        {cards.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.cardType.replace('_', ' ')} - {c.cardNumber.slice(-4)}
                                {c.cardType.includes('CREDIT')
                                    ? ` (Avail: ₹${(c.creditLimit - c.usedAmount).toLocaleString()})`
                                    : ' (Linked to Account)'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Recipient Account Number</label>
                    <input
                        type="text"
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        placeholder="Enter account number"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Amount (INR)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        min="1"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Remarks (Optional)</label>
                    <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Payment for..."
                        className="form-input"
                    />
                </div>

                <button type="submit" className="action-btn" disabled={loading || cards.length === 0}>
                    {loading ? 'Processing...' : 'Send Money'}
                    {!loading && <FaPaperPlane />}
                </button>
            </form>

            {/* PIN Modal */}
            {showPinModal && (
                <div className="pin-modal-overlay">
                    <div className="pin-modal">
                        <button className="close-modal-btn" onClick={() => setShowPinModal(false)}>
                            <FaTimes />
                        </button>
                        <h3>Enter Card PIN</h3>
                        <p>Please enter your 4-digit PIN to confirm payment.</p>
                        <input
                            type="password"
                            maxLength="4"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            className="pin-input"
                            autoFocus
                        />
                        <button className="confirm-btn" onClick={handlePinSubmit} disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardTransfer;
