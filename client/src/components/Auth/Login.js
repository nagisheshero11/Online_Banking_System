import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaCheck, FaCreditCard, FaUser, FaUniversity, FaWifi } from 'react-icons/fa';
import './styles/Login.css';
import { login } from '../../services/authAPI';

import { useToast } from '../../context/ToastContext';

const Login = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loginError, setLoginError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (loginError) setLoginError(''); // Clear error on input
    };

    // Handle login submit
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submitted", formData);
        setLoginError(''); // Clear previous error

        try {
            const data = await login(formData);
            localStorage.setItem("role", data.role);
            const role = data.role;

            if (role === "ADMIN") {
                navigate('/admin/dashboard', { state: { showLoginSuccess: true } });
            } else if (role === "USER") {
                navigate('/dashboard', { state: { showLoginSuccess: true } });
            } else {
                setLoginError("Invalid role received from server");
            }

        } catch (error) {
            // User requested "Invalid Credentials" specifically
            let msg = error.message || 'Login failed';
            if (msg.toLowerCase().includes('forbidden') || msg.includes('403') || msg.includes('401')) {
                msg = 'Invalid Credentials';
            }
            setLoginError(msg);
        }
    };

    return (
        <div className="login-page-split">
            {/* --- Left Side: Login Form --- */}
            <div className="login-left-panel">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2 className="login-title">Sign in</h2>
                        <p className="login-subtitle">Use your email and password.</p>
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

                    <form onSubmit={onSubmit} className="login-form">
                        <div className="input-group-split">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="text"
                                name="emailOrUsername"
                                placeholder="Email / Username"
                                className="split-input"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group-split">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="split-input"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        {loginError && (
                            <div className="login-error-msg">
                                {loginError}
                            </div>
                        )}

                        <button type="submit" className="split-btn-primary">
                            Login
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>New here? <Link to="/signup" className="link-highlight">Create an account</Link></p>
                    </div>
                </div>
            </div>

            {/* --- Right Side: Visual Grid --- */}
            <div className="login-right-panel">
                <div className="visual-grid-container">

                    {/* Floating Card 1: User Profile */}
                    <div className="floating-card card-profile">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>
                        <div className="profile-info">
                            <span className="p-name">Lewis Hamilton</span>
                            <span className="p-tag">Premium User</span>
                        </div>
                    </div>

                    {/* Floating Card 2: Transaction Success */}
                    <div className="floating-card card-transaction">
                        <div className="trans-icon-box">
                            <FaCheck />
                        </div>
                        <div className="trans-details">
                            <span className="t-title">Successful transaction</span>
                            <span className="t-amount">₹ 1,250.00</span>
                        </div>
                    </div>

                    {/* Floating Card 3: Bank Selection */}
                    <div className="floating-card card-banks">
                        <span className="bank-label">Select bank Type</span>
                        <div className="bank-logos">
                            <div className="bank-logo"><FaUniversity /></div>
                            <div className="bank-logo">Current</div>
                            <div className="bank-logo">Savings</div>
                        </div>
                    </div>

                    {/* Floating Card 4: Credit Card */}
                    <div className="floating-card card-credit">
                        <div className="cc-top">
                            <span className="cc-chip"></span>
                            <FaWifi className="cc-wifi" />
                        </div>
                        <div className="cc-number">**** 1644</div>
                        <div className="cc-bottom">
                            <span>Lewis Hamilton</span>
                            <span className="cc-brand">VISA</span>
                        </div>
                    </div>

                    {/* Floating Card 5: Savings Goal */}
                    <div className="floating-card card-savings">
                        <div className="savings-header">
                            <span className="s-title">Vacation Fund</span>
                            <span className="s-amount">85%</span>
                        </div>
                        <div className="savings-bar-bg">
                            <div className="savings-bar-fill"></div>
                        </div>
                        <span className="s-target">₹8,500 / ₹10k</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;