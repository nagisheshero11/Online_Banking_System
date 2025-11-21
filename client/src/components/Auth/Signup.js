import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCreditCard, FaLock } from 'react-icons/fa';
import './styles/Signup.css';
import { signup } from '../../services/authAPI';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        panNumber: '',
        password: '',
        accountNumber: '',
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'accountNumber' ? value.toUpperCase() : value,
        });
    };

    const validateAccountNumber = (number) => /^BK(SV|CR)\d{7}$/.test(number);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!validateAccountNumber(formData.accountNumber)) {
            setErrorMsg(
                "Invalid account number! Format: BK + SV/CR + 7 digits (e.g., BKSV1234567)"
            );
            return;
        }

        try {
            await signup(formData);
            setSuccessMsg('✅ Signup successful! Redirecting to login...');
            setTimeout(() => navigate('/login', { replace: true }), 2000);
        } catch (error) {
            setErrorMsg(error.message || 'Signup failed. Try again.');
        }
    };

    return (
        <div className="signup-page-split">
            {/* --- Left Side: Signup Form --- */}
            <div className="signup-left-panel">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                        <h2 className="signup-title">Create Account</h2>
                        <p className="signup-subtitle">Join Bankify today. It's fast and easy.</p>
                        <button
                            type="button"
                            className="back-to-landing"
                            onClick={() => navigate('/')}
                            aria-label="Back to landing page"
                            title="Back"
                        >
                            ←
                        </button>
                    </div>

                    {errorMsg && <div className="form-message error">{errorMsg}</div>}
                    {successMsg && <div className="form-message success">{successMsg}</div>}

                    <form onSubmit={onSubmit} className="signup-form">
                        <div className="form-row">
                            <div className="input-group-split">
                                <FaUser className="input-icon" />
                                <input type="text" name="firstName" placeholder="First Name" required className="split-input" onChange={handleChange} />
                            </div>
                            <div className="input-group-split">
                                <FaUser className="input-icon" />
                                <input type="text" name="lastName" placeholder="Last Name" required className="split-input" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="input-group-split">
                            <FaUser className="input-icon" />
                            <input type="text" name="username" placeholder="Username" required className="split-input" onChange={handleChange} />
                        </div>

                        <div className="input-group-split">
                            <FaEnvelope className="input-icon" />
                            <input type="email" name="email" placeholder="Email Address" required className="split-input" onChange={handleChange} />
                        </div>

                        <div className="input-group-split">
                            <FaPhone className="input-icon" />
                            <input type="tel" name="phoneNumber" placeholder="Phone Number" required className="split-input" onChange={handleChange} />
                        </div>

                        <div className="form-row">
                            <div className="input-group-split">
                                <FaIdCard className="input-icon" />
                                <input type="text" name="panNumber" placeholder="PAN Number" required className="split-input" onChange={handleChange} />
                            </div>
                            <div className="input-group-split">
                                <FaCreditCard className="input-icon" />
                                <input
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Account No. (BKSV...)"
                                    required
                                    value={formData.accountNumber}
                                    className="split-input"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <small className="input-hint">Account No: BK + SV/CR + 7 digits</small>

                        <div className="input-group-split">
                            <FaLock className="input-icon" />
                            <input type="password" name="password" placeholder="Password" required className="split-input" onChange={handleChange} />
                        </div>

                        <button type="submit" className="split-btn-primary">
                            Sign Up
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login" className="link-highlight">Sign in</Link></p>
                    </div>
                </div>
            </div>

            {/* --- Right Side: Live Activity Panel --- */}
            <div className="signup-right-panel">
                <div className="signup-visual-content">
                    <h2 className="visual-title">Join the Future.</h2>
                    <p className="visual-subtitle">Experience banking without boundaries.</p>

                    {/* Central Visual: Premium Black Card */}
                    <div className="visual-card-container">
                        <div className="premium-black-card">
                            <div className="card-chip"></div>
                            <div className="card-logo">Bankify</div>
                            <div className="card-number">•••• •••• •••• 1644</div>
                            <div className="card-holder">
                                <span>Lewis Hamilton</span>
                                <span>16/44</span>
                            </div>
                        </div>
                        <div className="card-glow"></div>
                    </div>
                </div>

                {/* Bottom: Infinite Marquee */}
                <div className="marquee-wrapper">
                    <div className="marquee-track">
                        {/* Duplicate items for seamless loop */}
                        {[...Array(2)].map((_, i) => (
                            <React.Fragment key={i}>
                                <div className="trans-pill incoming">+ ₹5,400 Salary</div>
                                <div className="trans-pill outgoing">- ₹14.99 Netflix</div>
                                <div className="trans-pill failed">! ₹1,200 Transfer Failed</div>
                                <div className="trans-pill incoming">+ ₹250.00 Freelance</div>
                                <div className="trans-pill outgoing">- ₹45.00 Uber Eats</div>
                                <div className="trans-pill failed">! ₹50.00 Declined</div>
                                <div className="trans-pill incoming">+ ₹1,200 Dividend</div>
                                <div className="trans-pill outgoing">- ₹120.00 Spotify</div>
                                <div className="trans-pill incoming">+ ₹850.00 Refund</div>
                                <div className="trans-pill outgoing">- ₹299.00 Apple Store</div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;