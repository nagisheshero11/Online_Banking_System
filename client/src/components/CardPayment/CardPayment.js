import React, { useState, useEffect } from 'react';
import { getMyCards, sendCardPayment } from '../../services/cardAPI';
import { FaCreditCard, FaPaperPlane, FaUser, FaRupeeSign, FaTimes } from 'react-icons/fa';
import './CardPayment.css';

const CardPayment = () => {
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
            console.log("Fetched Cards:", data); // Debugging

            // Filter Active Credit Cards (Case Insensitive)
            const validCards = data.filter(c =>
                c.status?.toUpperCase() === 'ACTIVE' &&
                c.cardType?.toUpperCase().includes('CREDIT')
            );

            console.log("Valid Credit Cards:", validCards);
            setCards(validCards);

            if (validCards.length > 0) {
                setSelectedCardId(validCards[0].id);
            } else {
                // If no active credit cards, check if they have any cards at all to give better error
                if (data.length > 0) {
                    setMessage({ type: 'error', text: 'You have cards, but none are Active Credit Cards.' });
                } else {
                    setMessage({ type: 'error', text: 'No cards found. Please apply for a card first.' });
                }
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
            setMessage({ type: 'error', text: 'Please select a valid credit card.' });
            return;
        }

        // Open PIN Modal
        setShowPinModal(true);
    };

    const handlePinSubmit = async () => {
        if (!pin || pin.length !== 4) {
            setMessage({ type: 'error', text: 'Please enter a valid 4-digit PIN.' });
            return;
        }

        setLoading(true);
        setShowPinModal(false); // Close modal while processing

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
            // Re-open modal if it was just a wrong PIN? Maybe not, let them retry.
        }
        setLoading(false);
    };

    return (
        <div className="card-payment-container">
            <div className="payment-card">
                <div className="payment-header">
                    <h2><FaCreditCard /> Card Payment</h2>
                    <p>Send money instantly using your Credit Card</p>
                </div>

                {message && (
                    <div className={`message-box ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                        <label>Select Card</label>
                        <select
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                            className="form-select"
                        >
                            {cards.length === 0 && <option>No Active Credit Cards</option>}
                            {cards.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.cardType.replace('_', ' ')} - {c.cardNumber.slice(-4)} (Avail: ₹{(c.creditLimit - c.usedAmount).toLocaleString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label><FaUser /> Recipient Account Number</label>
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
                        <label><FaRupeeSign /> Amount</label>
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

                    <button type="submit" className="pay-btn" disabled={loading || cards.length === 0}>
                        {loading ? 'Processing...' : <><FaPaperPlane /> Send Money</>}
                    </button>
                </form>
            </div>

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

export default CardPayment;
