import React, { useState, useEffect } from 'react';
import { FaPlus, FaBan, FaInfoCircle, FaKey, FaTimes, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import ApplyCardForm from '../ApplyCard/ApplyCardForm';
import { getMyCards, applyForCard, blockCard, unblockCard, setCardPin, simulateTransaction, generateBill } from '../../services/cardAPI';
import { getUserProfile } from '../../services/profileAPI';
import './styles/Cards.css';
import { useToast } from '../../context/ToastContext';

// Initial state is empty, fetched from API
const initialOwned = [];

const availableCards = [
    {
        id: 'PLATINUM_DEBIT',
        name: 'Platinum Debit Card',
        type: 'Debit',
        fee: 'Free',
        feeValue: 0,
        color: 'card-gradient-lime',
        benefits: ['Zero annual fee', 'High ATM withdrawal limits', 'Global acceptance'],
    },
    {
        id: 'SIGNATURE_CREDIT',
        name: 'Signature Credit Card',
        type: 'Credit',
        fee: '₹2,999 / year',
        feeValue: 2999,
        color: 'card-gradient-black',
        benefits: ['5% cashback on online spends', 'Airport lounge access', 'Fuel surcharge waiver'],
    },
    {
        id: 'NORMAL_CREDIT',
        name: 'Normal Credit Card',
        type: 'Credit',
        fee: '₹499 / year',
        feeValue: 499,
        color: 'card-gradient-grey',
        benefits: ['1% cashback on all spends', 'Low interest rates', 'EMI options'],
    },
];

const Cards = () => {
    const { showToast } = useToast();
    const [ownedCards, setOwnedCards] = useState(initialOwned);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    // Apply Form State
    const [applyStep, setApplyStep] = useState('select'); // 'select' | 'form' | 'success'
    const [selectedApplyCardId, setSelectedApplyCardId] = useState(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);


    const [cvvVisible, setCvvVisible] = useState(false);
    const [userFullName, setUserFullName] = useState('');
    // Fetch logged‑in user's full name on component mount
    useEffect(() => {
        const fetchName = async () => {
            try {
                const data = await getUserProfile();
                const full = `${data.firstName || ''} ${data.lastName || ''}`.trim();
                setUserFullName(full);
            } catch (e) {
                console.error('Failed to fetch user profile for card name', e);
            }
        };
        fetchName();
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const data = await getMyCards();
            // Map backend data to frontend format
            const formatted = data.map(c => ({
                id: c.id,
                name: getCardNameByType(c.cardType),
                type: c.cardType.includes('DEBIT') ? 'Debit' : 'Credit',
                color: getCardColorByType(c.cardType),
                number: c.cardNumber,
                holder: c.cardHolder,
                expiry: c.expiryDate,
                status: mapBackendStatus(c.status), // Correctly map status
                brand: 'VISA',
                cvv: c.cvv,
                creditLimit: c.creditLimit,
                usedAmount: c.usedAmount,
                availableLimit: c.creditLimit ? c.creditLimit - c.usedAmount : 0,
                rawType: c.cardType // Store raw type for comparison
            }));
            setOwnedCards(formatted);
        } catch (err) {
            console.error("Failed to fetch cards", err);
        }
    };

    const mapBackendStatus = (status) => {
        if (status === 'ACTIVE') return 'Active';
        if (status === 'BLOCKED') return 'Blocked';
        if (status === 'REJECTED') return 'Rejected';
        return 'Pending';
    };

    const getCardNameByType = (type) => {
        if (type === 'PLATINUM_DEBIT') return 'Platinum Debit';
        if (type === 'SIGNATURE_CREDIT') return 'Signature Credit';
        return 'Normal Credit';
    };

    const getCardColorByType = (type) => {
        if (type === 'PLATINUM_DEBIT') return 'card-gradient-lime';
        if (type === 'SIGNATURE_CREDIT') return 'card-gradient-black';
        return 'card-gradient-grey';
    };

    const selectedCard = ownedCards[selectedCardIndex];

    // Reset flip and CVV visibility when changing cards
    React.useEffect(() => {
        setIsFlipped(false);
        setCvvVisible(false);
    }, [selectedCardIndex]);

    // Card interaction handlers
    const handleSelectCard = (index) => {
        if (selectedCardIndex === index) {
            // Deselect if clicking the same card
            setSelectedCardIndex(null);
        } else {
            setSelectedCardIndex(index);
        }
    };

    const handleFlipCard = (index) => {
        // Flip only if this card is already selected
        if (selectedCardIndex === index) {
            const newFlipped = !isFlipped;
            setIsFlipped(newFlipped);
            // When flipping back, hide CVV again
            if (!newFlipped) {
                setCvvVisible(false);
            }
        } else {
            // Selecting a different card resets flip
            setSelectedCardIndex(index);
            setIsFlipped(false);
            setCvvVisible(false);
        }
    };

    // Ensure CVV click does not trigger card selection/flip
    const handleCvvClick = (e) => {
        e.stopPropagation();
        setCvvVisible(!cvvVisible);
    };

    const handleBlockToggle = async () => {
        if (!selectedCard) return;
        try {
            if (selectedCard.status === 'Active') {
                await blockCard(selectedCard.id);
            } else {
                await unblockCard(selectedCard.id);
            }
            await fetchCards(); // Refresh
        } catch (err) {
            showToast("Failed to update card status", 'error');
        }
    };

    const handleSetPin = async () => {
        if (!newPin || newPin.length !== 4) {
            showToast("PIN must be 4 digits", 'error');
            return;
        }
        try {
            await setCardPin(selectedCard.id, newPin);
            showToast("PIN set successfully!", 'success');
            setShowPinModal(false);
            setNewPin('');
        } catch (err) {
            showToast("Failed to set PIN", 'error');
        }
    };

    const handleSimulateTxn = async () => {
        const amount = prompt("Enter transaction amount:");
        if (!amount) return;
        try {
            await simulateTransaction(selectedCard.id, amount);
            showToast("Transaction Successful!", 'success');
            fetchCards();
        } catch (err) {
            showToast("Transaction Failed: " + (err.response?.data?.message || err.message), 'error');
        }
    };

    const handleGenerateBill = async () => {
        try {
            await generateBill(selectedCard.id);
            showToast("Bill Generated Successfully! Check 'Pay Bills' section.", 'success');
        } catch (err) {
            showToast("Bill Generation Failed: " + (err.response?.data?.message || err.message), 'error');
        }
    };

    const openApplyModal = () => {
        setApplyStep('select');
        setSelectedApplyCardId(null);
        setShowApplyModal(true);
    };

    const handleApplySelect = (cardId) => {
        setSelectedApplyCardId(cardId);
        setApplyStep('form');
    };

    const handleApplySubmit = async (formData) => {
        try {
            await applyForCard(formData.cardType);
            setApplyStep('success');
            setTimeout(() => {
                setShowApplyModal(false);
                fetchCards(); // Refresh list (though it might be pending)
            }, 2000);
        } catch (err) {
            showToast("Application failed: " + err.message, 'error');
        }
    };

    return (
        <div className="cards-page-container">
            {/* Header */}
            <header className="cards-header">
                <h1 className="header-title">Your Cards</h1>
                <div className="header-actions">
                    <button className="add-card-btn" onClick={openApplyModal}>
                        <FaPlus /> Add new card
                    </button>
                </div>
            </header>

            {/* Card Carousel */}
            <section className="cards-carousel-section">
                <div className="cards-scroll-container">
                    {ownedCards.map((card, index) => (
                        <div
                            key={card.id}
                            className={`card-visual-wrapper ${index === selectedCardIndex ? 'selected' : ''}`}
                            onClick={() => handleSelectCard(index)}
                            onDoubleClick={() => handleFlipCard(index)}
                        >
                            <div className={`zen-card-inner ${index === selectedCardIndex && isFlipped ? 'flipped' : ''}`}>
                                {/* FRONT FACE */}
                                <div className={`zen-card-front ${card.color}`}>
                                    <div className="card-brand">{card.brand}</div>
                                    <div className="card-chip"></div>
                                    <div className="card-number">{card.number}</div>
                                    <div className="card-footer">
                                        <div>
                                            <div className="card-holder-name">{userFullName || card.holder}</div>
                                        </div>
                                        <div className="card-expiry">{card.expiry}</div>
                                    </div>
                                    {card.status === 'Pending' && (
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'rgba(0,0,0,0.6)', borderRadius: '16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                            backdropFilter: 'blur(2px)'
                                        }}>
                                            PENDING APPROVAL
                                        </div>
                                    )}
                                    {card.status === 'Rejected' && (
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'rgba(220, 38, 38, 0.8)', borderRadius: '16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                            backdropFilter: 'blur(2px)'
                                        }}>
                                            CARD REJECTED
                                        </div>
                                    )}
                                </div>

                                {/* BACK FACE */}
                                <div className={`zen-card-back ${card.color}`}>
                                    <div className="card-magnetic-strip"></div>
                                    <div className="card-signature-row">
                                        <div className="card-signature"></div>
                                        <div className="card-cvv-box" onClick={handleCvvClick} style={{ cursor: 'pointer' }}>
                                            <span className="cvv-label">CVV</span>
                                            <span className="cvv-value">{cvvVisible ? card.cvv : '•••'}</span>
                                        </div>
                                    </div>
                                    <div className="card-back-text">
                                        This card is property of Bankify. If found, please return to nearest branch.
                                    </div>
                                    <div className="card-brand-small">{card.brand}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Management Panel */}
            {selectedCard && selectedCard.status !== 'Rejected' && (
                <section className="management-panel">
                    <div className="panel-left">
                        <h3 className="panel-section-title">Card Management</h3>
                        <div className="actions-grid">
                            <div className="action-item" onClick={() => setShowDetailsModal(true)}>
                                <div className="action-left">
                                    <div className="action-icon"><FaInfoCircle /></div>
                                    <span className="action-label">Card Details</span>
                                </div>
                                <span className="action-arrow">→</span>
                            </div>

                            <div className={`action-item ${selectedCard.status === 'Pending' ? 'disabled' : ''}`}
                                onClick={() => selectedCard.status !== 'Pending' && setShowPinModal(true)}
                                style={{ opacity: selectedCard.status === 'Pending' ? 0.5 : 1 }}
                            >
                                <div className="action-left">
                                    <div className="action-icon"><FaKey /></div>
                                    <span className="action-label">Set / Change PIN</span>
                                </div>
                                <span className="action-arrow">→</span>
                            </div>

                            <div className={`action-item ${selectedCard.status === 'Pending' ? 'disabled' : ''}`}
                                onClick={() => selectedCard.status !== 'Pending' && handleBlockToggle()}
                                style={{ opacity: selectedCard.status === 'Pending' ? 0.5 : 1 }}
                            >
                                <div className="action-left">
                                    <div className="action-icon" style={{ color: selectedCard.status === 'Blocked' ? 'red' : 'inherit' }}>
                                        <FaBan />
                                    </div>
                                    <span className="action-label">
                                        {selectedCard.status === 'Blocked' ? 'Unblock Card' : 'Block Card'}
                                    </span>
                                </div>
                                <span className="action-arrow">→</span>
                            </div>

                            {selectedCard.type === 'Credit' && selectedCard.status === 'Active' && (
                                <>
                                    <div className="action-item" onClick={handleSimulateTxn}>
                                        <div className="action-left">
                                            <div className="action-icon"><FaCreditCard /></div>
                                            <span className="action-label">Simulate Transaction</span>
                                        </div>
                                        <span className="action-arrow">→</span>
                                    </div>
                                    <div className="action-item" onClick={handleGenerateBill}>
                                        <div className="action-left">
                                            <div className="action-icon"><FaCheckCircle /></div>
                                            <span className="action-label">Generate Bill</span>
                                        </div>
                                        <span className="action-arrow">→</span>
                                    </div>
                                    <div style={{ marginTop: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: '#64748B' }}>Credit Limit</span>
                                            <strong>₹{selectedCard.creditLimit?.toLocaleString()}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: '#64748B' }}>Used Amount</span>
                                            <strong>₹{selectedCard.usedAmount?.toLocaleString()}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                                            <span>Available</span>
                                            <strong>₹{selectedCard.availableLimit?.toLocaleString()}</strong>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {selectedCard && selectedCard.status === 'Rejected' && (
                <section className="management-panel" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#EF4444', padding: '20px' }}>
                        <h3>Application Rejected</h3>
                        <p>This card application was declined by the bank.</p>
                        <button
                            onClick={() => {/* Logic to remove card could go here */ }}
                            style={{ marginTop: '10px', padding: '8px 16px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'not-allowed', opacity: 0.7 }}
                        >
                            Contact Support
                        </button>
                    </div>
                </section>
            )}

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="apply-modal-overlay">
                    <div className="apply-modal-content">
                        <button className="close-modal-btn" onClick={() => setShowApplyModal(false)}>
                            <FaTimes />
                        </button>

                        {applyStep === 'select' && (
                            <div>
                                <h2 style={{ marginBottom: '20px' }}>Select a Card</h2>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {availableCards.map(c => {
                                        // Check if user already owns this card type (and not rejected)
                                        const isOwned = ownedCards.some(owned => owned.rawType === c.id && owned.status !== 'Rejected');

                                        return (
                                            <div
                                                key={c.id}
                                                onClick={() => !isOwned && handleApplySelect(c.id)}
                                                style={{
                                                    padding: '16px',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '12px',
                                                    cursor: isOwned ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    opacity: isOwned ? 0.5 : 1,
                                                    background: isOwned ? '#F1F5F9' : 'white'
                                                }}
                                                title={isOwned ? "You already have this card" : ""}
                                            >
                                                <div className={`zen-card ${c.color}`} style={{ width: '60px', height: '40px', borderRadius: '6px', padding: '0', filter: isOwned ? 'grayscale(100%)' : 'none' }}></div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: isOwned ? '#94A3B8' : 'inherit' }}>
                                                        {c.name} {isOwned && <span style={{ fontSize: '0.8rem', color: '#DC2626', marginLeft: '8px' }}>(Owned)</span>}
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{c.type} • {c.fee}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {applyStep === 'form' && selectedApplyCardId && (
                            <ApplyCardForm
                                selectedCard={availableCards.find(c => c.id === selectedApplyCardId)}
                                cardOptions={availableCards}
                                onChangeCard={setSelectedApplyCardId}
                                onSubmit={handleApplySubmit}
                                onCancel={() => setApplyStep('select')}
                            />
                        )}

                        {applyStep === 'success' && (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <FaCheckCircle style={{ fontSize: '3rem', color: '#16A34A', marginBottom: '16px' }} />
                                <h2>Application Submitted!</h2>
                                <p style={{ color: '#64748B' }}>Your new card is being processed and will appear in your dashboard shortly.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Set PIN Modal */}
            {showPinModal && (
                <div className="apply-modal-overlay">
                    <div className="apply-modal-content" style={{ maxWidth: '400px' }}>
                        <button className="close-modal-btn" onClick={() => setShowPinModal(false)}>
                            <FaTimes />
                        </button>
                        <h3>Set Card PIN</h3>
                        <p style={{ color: '#64748B', marginBottom: '20px' }}>Enter a 4-digit PIN for your card.</p>
                        <input
                            type="password"
                            maxLength="4"
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                            className="pin-input"
                            style={{
                                width: '100%', padding: '12px', fontSize: '1.5rem', textAlign: 'center',
                                letterSpacing: '8px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px'
                            }}
                        />
                        <button
                            onClick={handleSetPin}
                            style={{
                                width: '100%', padding: '14px', background: '#0F172A', color: 'white',
                                border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Set PIN
                        </button>
                    </div>
                </div>
            )}

            {/* Card Details Modal */}
            {showDetailsModal && selectedCard && (
                <div className="apply-modal-overlay">
                    <div className="apply-modal-content" style={{ maxWidth: '450px' }}>
                        <button className="close-modal-btn" onClick={() => setShowDetailsModal(false)}>
                            <FaTimes />
                        </button>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaCreditCard /> Card Details
                        </h3>

                        <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B' }}>Card Number</span>
                                <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{selectedCard.number}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B' }}>Card Holder</span>
                                <span style={{ fontWeight: '600' }}>{selectedCard.holder}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B' }}>Expiry Date</span>
                                <span style={{ fontWeight: '600' }}>{selectedCard.expiry}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B' }}>CVV</span>
                                <span style={{ fontWeight: '600' }}>{selectedCard.cvv}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B' }}>Type</span>
                                <span style={{ fontWeight: '600' }}>{selectedCard.type}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B' }}>Status</span>
                                <span style={{
                                    fontWeight: '600',
                                    color: selectedCard.status === 'Active' ? '#16A34A' :
                                        selectedCard.status === 'Blocked' ? '#DC2626' : '#CA8A04'
                                }}>
                                    {selectedCard.status}
                                </span>
                            </div>
                            {selectedCard.type === 'Credit' && (
                                <>
                                    <div style={{ height: '1px', background: '#E2E8F0', margin: '8px 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748B' }}>Credit Limit</span>
                                        <span style={{ fontWeight: '600' }}>₹{selectedCard.creditLimit?.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748B' }}>Available</span>
                                        <span style={{ fontWeight: '600', color: '#16A34A' }}>₹{selectedCard.availableLimit?.toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cards;
