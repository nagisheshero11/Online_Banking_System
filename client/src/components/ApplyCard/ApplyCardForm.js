import React, { useState } from 'react';
import { FaCreditCard, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const ApplyCardForm = ({ selectedCard, cardOptions = [], onChangeCard, onSubmit, onCancel }) => {
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreed) return;
        onSubmit({ cardType: selectedCard.id });
    };

    const feeValue = selectedCard.feeValue || 0;
    const isFree = feeValue === 0;

    return (
        <section aria-label="Application confirmation">
            {/* Form toolbar with card switcher */}
            <div className="form-toolbar">
                <label htmlFor="changeCard" className="toolbar-label">Selected Card</label>
                <select
                    id="changeCard"
                    className="change-card-select"
                    value={selectedCard.id}
                    onChange={(e) => onChangeCard && onChangeCard(e.target.value)}
                >
                    {cardOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Selected card visual */}
            <div className="selected-card-visual">
                <div className={`card-mock ${selectedCard.color}`} aria-hidden="true">
                    <FaCreditCard className="card-mock-icon" />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'white', fontWeight: 'bold' }}>
                        {selectedCard.name}
                    </div>
                </div>
            </div>

            <form className="apply-card-form" onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                <div style={{ margin: '20px 0', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#0F172A' }}>Application Summary</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1rem' }}>
                        <span style={{ color: '#64748B' }}>Card Type</span>
                        <strong style={{ color: '#0F172A' }}>{selectedCard.name}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B' }}>Application Fee</span>
                        <strong style={{ color: isFree ? '#16A34A' : '#0F172A' }}>
                            {isFree ? 'FREE' : `₹${feeValue.toLocaleString()}`}
                        </strong>
                    </div>
                </div>

                {!isFree && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left', margin: '20px 0', padding: '12px', background: '#FFF7ED', borderRadius: '8px', border: '1px solid #FFEDD5' }}>
                        <FaInfoCircle style={{ color: '#EA580C', marginTop: '3px', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#9A3412' }}>
                            By proceeding, <strong>₹{feeValue.toLocaleString()}</strong> will be deducted from your account balance immediately.
                        </p>
                    </div>
                )}

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', margin: '24px 0' }}>
                    <input
                        type="checkbox"
                        id="agree-checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="agree-checkbox" style={{ cursor: 'pointer', userSelect: 'none', color: '#334155' }}>
                        I agree to the terms and authorize this request.
                    </label>
                </div>

                <div className="form-actions">
                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={!agreed}
                        style={{ opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed' }}
                    >
                        {isFree ? 'Confirm & Apply' : `Pay ₹${feeValue.toLocaleString()} & Apply`}
                    </button>
                    <button className="secondary-btn" type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </section>
    );
};

export default ApplyCardForm;
