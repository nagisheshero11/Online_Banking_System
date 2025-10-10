import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css';
import Toast from '../Common/Toast';

const Icon = ({ path, className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const EmailIcon = () => (
    <Icon
        className="form-input-icon"
        path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
    />
);
const LockIcon = () => (
    <Icon
        className="form-input-icon"
        path="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
    />
);

const Login = () => {
    const navigate = useNavigate();
    const onSubmit = (e) => {
        e.preventDefault();
        // Navigate immediately and let Dashboard show success toast
        navigate('/dashboard', { state: { showLoginSuccess: true } });
    };

    return (
        <div className="auth-page">
            {/* Toast moved to Dashboard after navigation */}
            <div className="auth-card">
                <div className="auth-brand-panel">
                    <h2>BANKIFY</h2>
                    <p>Welcome back! Sign in to continue.</p>
                    <svg
                        className="brand-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                </div>

                <div className="auth-form-panel">
                    {/* Optional close/back behavior to mimic modal close */}
                    <button
                        type="button"
                        aria-label="Close"
                        className="auth-modal-close-btn"
                        onClick={() => navigate('/')}
                    >
                        &times;
                    </button>
                    <h3>Sign in</h3>
                    <p className="form-subtitle">Use your email and password.</p>

                    <form onSubmit={onSubmit}>
                        <div className="form-input-group">
                            <EmailIcon />
                            <input type="email" placeholder="Email / Username" className="form-input" required />
                        </div>
                        <div className="form-input-group">
                            <LockIcon />
                            <input type="password" placeholder="Password" className="form-input" required />
                        </div>
                        <button type="submit" className="form-button">Login</button>
                    </form>

                    <p className="form-switch-text">
                        New here? <Link to="/signup" className="form-switch-link">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
