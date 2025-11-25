import React, { useState, useEffect } from 'react';
import { FaPlus, FaBan, FaInfoCircle, FaKey, FaTimes, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import ApplyCardForm from '../ApplyCard/ApplyCardForm';
import { getUserProfile } from '../../services/profileAPI'; // fetch logged‑in user profile
import './styles/Cards.css';

// Mock Data for Owned Cards
const initialOwned = [
    {
        id: 'c1',
        name: 'Platinum Debit',
        type: 'Debit',
        color: 'card-gradient-lime',
        number: '4532 12** **** 7890',
        holder: 'NAGI SEISHIRO',
        expiry: '12/28',
        status: 'Active',
        brand: 'VISA'
    },
    {
        id: 'c2',
        name: 'Signature Credit',
        type: 'Credit',
        color: 'card-gradient-black',
        number: '5412 75** **** 3421',
        holder: 'NAGI SEISHIRO',
        expiry: '09/26',
        status: 'Active',
        brand: 'VISA'
    },
    {
        id: 'c3',
        name: 'Virtual Card',
        type: 'Virtual',
        color: 'card-gradient-grey',
        number: '4111 11** **** 1111',
        holder: 'NAGI SEISHIRO',
        expiry: '01/30',
        status: 'Active',
        brand: 'VISA'
    }
];

// Mock Data for Available Cards (for applying)
const availableCards = [
    {
        id: 'platinum-debit',
        name: 'Platinum Debit Card',
        type: 'Debit',
        fee: 'Free',
        color: 'card-gradient-lime',
        benefits: ['Zero annual fee', 'High ATM withdrawal limits', 'Global acceptance'],
    },
    {
        id: 'signature-credit',
        name: 'Signature Credit Card',
        type: 'Credit',
        fee: '₹2,999 / year',
        color: 'card-gradient-black',
        benefits: ['5% cashback on online spends', 'Airport lounge access', 'Fuel surcharge waiver'],
    },
    {
        id: 'virtual-card',
        name: 'Virtual Card',
        type: 'Virtual',
        fee: 'Free',
        color: 'card-gradient-grey',
        benefits: ['Instant issuance', 'Safe online payments', 'Dynamic CVV'],
    },
];

const Cards = () => {
    const [ownedCards, setOwnedCards] = useState(initialOwned);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    // Apply Form State
    const [applyStep, setApplyStep] = useState('select'); // 'select' | 'form' | 'success'
    const [selectedApplyCardId, setSelectedApplyCardId] = useState(null);


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
    }, []);

    const selectedCard = ownedCards[selectedCardIndex];

    // Reset flip and CVV visibility when changing cards
    React.useEffect(() => {
        setIsFlipped(false);
        setCvvVisible(false);
    }, [selectedCardIndex]);

    // Card interaction handlers
    const handleSelectCard = (index) => {
        if (selectedCardIndex !== index) {
            setSelectedCardIndex(index);
        } else {
            // Toggle CVV visibility on single click of already selected card
            setCvvVisible(!cvvVisible);
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

    const handleBlockToggle = () => {
        if (!selectedCard) return;
        const updated = [...ownedCards];
        const card = updated[selectedCardIndex];
        card.status = card.status === 'Active' ? 'Blocked' : 'Active';
        setOwnedCards(updated);
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

    const handleApplySubmit = (formData) => {
        console.log("Applied:", formData);
        setApplyStep('success');

        // Mock adding the card
        const newCard = availableCards.find(c => c.id === formData.cardType);
        setTimeout(() => {
            setOwnedCards(prev => [...prev, {
                id: `new-${Date.now()}`,
                name: newCard.name,
                type: newCard.type,
                color: newCard.color,
                number: '4000 12** **** 9999',
                holder: formData.fullName.toUpperCase(),
                expiry: '12/29',
                status: 'Active',
                brand: 'VISA'
            }]);
            setShowApplyModal(false);
        }, 2000);
    };

    // ... (keep other functions like handleBlockToggle)

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
                                </div>

                                {/* BACK FACE */}
                                <div className={`zen-card-back ${card.color}`}>
                                    <div className="card-magnetic-strip"></div>
                                    <div className="card-signature-row">
                                        <div className="card-signature"></div>
                                        <div className="card-cvv-box" onClick={handleCvvClick} style={{ cursor: 'pointer' }}>
                                            <span className="cvv-label">CVV</span>
                                            <span className="cvv-value">{cvvVisible ? '123' : '•••'}</span>
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
            {selectedCard && (
                <section className="management-panel">
                    <div className="panel-left">
                        <h3 className="panel-section-title">Card Management</h3>
                        <div className="actions-grid">
                            <div className="action-item">
                                <div className="action-left">
                                    <div className="action-icon"><FaInfoCircle /></div>
                                    <span className="action-label">Card Details</span>
                                </div>
                                <span className="action-arrow">→</span>
                            </div>

                            <div className="action-item">
                                <div className="action-left">
                                    <div className="action-icon"><FaKey /></div>
                                    <span className="action-label">Change PIN</span>
                                </div>
                                <span className="action-arrow">→</span>
                            </div>

                            <div className="action-item" onClick={handleBlockToggle}>
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
                        </div>
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
                                    {availableCards.map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => handleApplySelect(c.id)}
                                            style={{
                                                padding: '16px',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px'
                                            }}
                                        >
                                            <div className={`zen-card ${c.color}`} style={{ width: '60px', height: '40px', borderRadius: '6px', padding: '0' }}></div>
                                            <div>
                                                <div style={{ fontWeight: '700' }}>{c.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{c.type} • {c.fee}</div>
                                            </div>
                                        </div>
                                    ))}
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
        </div>
    );
};

export default Cards;
