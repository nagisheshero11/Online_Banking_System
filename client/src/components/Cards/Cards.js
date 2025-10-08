import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import './styles/Cards.css';
import virtualCardImg from '../../assets/virtual_card.jpeg';
import debitCardImg from '../../assets/debit_card.jpeg';

// Two existing cards owned by the user
const initialOwned = [
    {
        id: 'virtual-card',
        name: 'Virtual Card',
        type: 'Virtual',
        color: 'gradient-orange',
        maskedNumber: '**** **** **** 4821',
        status: 'Active',
        limits: 'Online limit ₹50,000/day',
        issuedOn: '2024-06-12',
        image: virtualCardImg,
        info: 'Ideal for secure online payments with a dynamic CVV.'
    },
    {
        id: 'platinum-debit',
        name: 'Platinum Debit Card',
        type: 'Debit',
        color: 'gradient-blue',
        maskedNumber: '**** **** **** 7324',
        status: 'Active',
        limits: 'ATM withdrawal up to ₹1,00,000/day',
        issuedOn: '2023-11-28',
        image: debitCardImg,
        info: 'Zero annual fee. Global acceptance and higher ATM limits.'
    }
];

const Cards = () => {
    const [owned, setOwned] = useState(initialOwned);
    const blockedMap = useMemo(() => new Map(), []);
    const [blocked, setBlocked] = useState(() =>
        owned.reduce((acc, c) => ({ ...acc, [c.id]: c.status !== 'Active' }), {})
    );

    const toggleBlock = (id) => {
        setBlocked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const removeCard = (id) => {
        const card = owned.find((c) => c.id === id);
        if (!card) return;
        if (window.confirm(`Remove ${card.name}? This action cannot be undone.`)) {
            setOwned((prev) => prev.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="cards-container">
            <header className="cards-header">
                <div className="cards-header-left">
                    <h2>My Cards</h2>
                    <p>Manage your existing cards. Block or remove them anytime.</p>
                </div>
                <div className="cards-header-actions">
                    <Link to="/dashboard/apply-card" className="add-card-btn">+ Add Card</Link>
                </div>
            </header>

            {/* Owned cards list */}
            <section className="owned-cards">
                {owned.map((card) => (
                    <article key={card.id} className={`owned-card ${card.color}`}>
                        <div className="owned-card-media">
                            {card.image ? (
                                <img className="owned-card-img" src={card.image} alt={`${card.name} image`} />
                            ) : (
                                <div className={`owned-card-visual ${card.color}`} aria-hidden="true">
                                    <FaCreditCard className="owned-card-icon" />
                                </div>
                            )}
                        </div>
                        <div className="owned-card-body">
                            <div className="owned-card-header">
                                <h3 className="owned-card-title">{card.name}</h3>
                                <span className="owned-card-type">{card.type}</span>
                            </div>
                            <div className="owned-card-meta">
                                <span className="meta-item">{card.maskedNumber}</span>
                                <span className={`status-pill ${blocked[card.id] ? 'blocked' : 'active'}`}>
                                    {blocked[card.id] ? 'Blocked' : 'Active'}
                                </span>
                            </div>
                            <p className="owned-card-info">{card.info}</p>
                            <ul className="owned-card-details">
                                <li><strong>Limits:</strong> {card.limits}</li>
                                <li><strong>Issued on:</strong> {new Date(card.issuedOn).toLocaleDateString()}</li>
                            </ul>
                            <div className="owned-card-actions">
                                <button className="secondary-btn" type="button" onClick={() => toggleBlock(card.id)}>
                                    {blocked[card.id] ? 'Unblock Card' : 'Block Card'}
                                </button>
                                <button className="danger-btn" type="button" onClick={() => removeCard(card.id)}>
                                    Remove Card
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
                {owned.length === 0 && (
                    <div className="no-cards">
                        <p>You don’t have any active cards.</p>
                        <Link to="/dashboard/apply-card" className="apply-btn">Apply for a Card</Link>
                    </div>
                )}
            </section>

            {/* Safety banner */}
            <section className="cards-safety">
                <div className="safety-content">
                    <FaShieldAlt className="safety-icon" />
                    <div>
                        <h4>Your security is our priority</h4>
                        <p>Chip & PIN, instant lock/unlock, and real-time alerts keep your money safe.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cards;
