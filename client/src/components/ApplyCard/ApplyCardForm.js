import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaCreditCard } from 'react-icons/fa';

import { useToast } from '../../context/ToastContext';

const ApplyCardForm = ({ selectedCard, cardOptions = [], onChangeCard, onSubmit, onCancel }) => {
    const { showToast } = useToast();
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '' });
    const nameRef = useRef(null);

    useEffect(() => {
        // Focus the first field when form mounts
        nameRef.current?.focus();
    }, [selectedCard?.id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fullName, email, phone, address } = form;
        if (!fullName || !email || !phone || !address) {
            showToast('Please fill all required fields.', 'error');
            return;
        }
        onSubmit({ ...form, cardType: selectedCard.id });
    };

    return (
        <section aria-label="Application form">
            {/* Form toolbar with card switcher */}
            <div className="form-toolbar">
                <label htmlFor="changeCard" className="toolbar-label">Card</label>
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

            {/* Selected card visual (image placeholder; will support real images) */}
            <div className="selected-card-visual">
                {selectedCard.image ? (
                    <img
                        className="selected-card-image"
                        src={selectedCard.image}
                        alt={`${selectedCard.name} preview`}
                    />
                ) : (
                    <div className={`card-mock ${selectedCard.color}`} aria-hidden="true">
                        <FaCreditCard className="card-mock-icon" />
                    </div>
                )}
            </div>

            <form className="apply-card-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="fullName"><FaUser /> Full Name *</label>
                    <input ref={nameRef} id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className="form-input" placeholder="Enter your full name" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email"><FaEnvelope /> Email *</label>
                    <input id="email" type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="phone"><FaPhone /> Phone *</label>
                    <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 98765 43210" />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="address"><FaHome /> Address *</label>
                    <textarea id="address" name="address" value={form.address} onChange={handleChange} className="form-textarea" rows="3" placeholder="Your full address" />
                </div>

                <div className="form-actions">
                    <button className="primary-btn" type="submit">Submit Application</button>
                    <button className="secondary-btn" type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </section>
    );
};

export default ApplyCardForm;
