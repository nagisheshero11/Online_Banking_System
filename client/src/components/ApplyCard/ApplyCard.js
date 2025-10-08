import React, { useState } from 'react';
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import './styles/ApplyCard.css';
import ApplyCardForm from './ApplyCardForm';
import virtualCardImg from '../../assets/virtual_card.jpeg';
import debitCardImg from '../../assets/debit_card.jpeg';
import creditCardImg from '../../assets/credit_card.jpeg';

// Bank-offered cards (same options as Cards page)
const availableCards = [
    {
        id: 'platinum-debit',
        name: 'Platinum Debit Card',
        type: 'Debit',
        fee: 'Free',
        color: 'gradient-blue',
        benefits: ['Zero annual fee', 'High ATM withdrawal limits', 'Global acceptance'],
        image: debitCardImg,
    },
    {
        id: 'signature-credit',
        name: 'Signature Credit Card',
        type: 'Credit',
        fee: '₹2,999 / year',
        color: 'gradient-green',
        benefits: ['5% cashback on online spends', 'Airport lounge access', 'Fuel surcharge waiver'],
        image: creditCardImg,
    },
    {
        id: 'virtual-card',
        name: 'Virtual Card',
        type: 'Virtual',
        fee: 'Free',
        color: 'gradient-orange',
        benefits: ['Instant issuance', 'Safe online payments', 'Dynamic CVV'],
        image: virtualCardImg,
    },
];

const ApplyCard = () => {
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const selectedCard = availableCards.find(c => c.id === selectedCardId) || null;

    const startApplication = (cardId) => {
        setSelectedCardId(cardId);
        setSubmitted(false);
    };

    const cancelApplication = () => {
        setSelectedCardId(null);
        setSubmitted(false);
    };

    const handleSubmit = (payload) => {
        // payload contains fullName, email, phone, address, cardType
        console.log('Application submitted:', payload);
        setSubmitted(true);
    };

    return (
        <div className="apply-card-container">
            <header className="apply-card-header">
                <h2>Apply for a Card</h2>
                <p>Fill in your details to complete your card application.</p>
            </header>

            <div className="apply-card-card">

                {!submitted ? (
                    <>
                        {/* Choose Card Options */}
                        {!selectedCard && (
                            <section className="apply-options">
                                <h3 className="section-title">Choose a Card</h3>
                                <div className="apply-options-grid">
                                    {availableCards.map((card) => (
                                        <div
                                            key={card.id}
                                            className={`apply-option-card ${card.color}`}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startApplication(card.id); }}
                                        >
                                            <div className={`option-image ${card.image ? 'has-image' : ''}`}>
                                                {card.image ? (
                                                    <img className="option-img" src={card.image} alt={`${card.name} image`} />
                                                ) : (
                                                    <FaCreditCard className="option-illustration" />
                                                )}
                                            </div>
                                            <div className="option-body">
                                                <div className="option-meta">
                                                    <span className="option-type">{card.type}</span>
                                                    <span className="option-fee">{card.fee}</span>
                                                </div>
                                                <h4 className="option-title">{card.name}</h4>
                                                <ul className="option-benefits">
                                                    {card.benefits.map((b, i) => (
                                                        <li key={i}>{b}</li>
                                                    ))}
                                                </ul>
                                                <div className="option-actions">
                                                    <button
                                                        type="button"
                                                        className="apply-btn"
                                                        onClick={() => startApplication(card.id)}
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {selectedCard && (
                            <ApplyCardForm
                                selectedCard={selectedCard}
                                cardOptions={availableCards}
                                onChangeCard={(cardId) => setSelectedCardId(cardId)}
                                onSubmit={handleSubmit}
                                onCancel={cancelApplication}
                            />
                        )}
                    </>
                ) : (
                    <div className="apply-success">
                        <FaCheckCircle className="success-icon" />
                        <h3>Application Submitted</h3>
                        <p>We've received your request for the selected card. Our team will contact you soon.</p>
                        <button className="primary-btn" onClick={cancelApplication}>Apply Another Card</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyCard;
