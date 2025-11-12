import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Signup.css';
import { signup } from '../../services/authAPI';

// Icon Utility
const Icon = ({ path, className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

// Icons
const UserIcon = () => <Icon className="form-input-icon" path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />;
const EmailIcon = () => <Icon className="form-input-icon" path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />;
const LockIcon = () => <Icon className="form-input-icon" path="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />;
const PhoneIcon = () => <Icon className="form-input-icon" path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
const UsernameIcon = () => <Icon className="form-input-icon" path="M5.121 17.804A4 4 0 019 16h2a4 4 0 013.879 1.804A8 8 0 104 9v2a8 8 0 001.121 6.804z" />;
const PanIcon = () => <Icon className="form-input-icon" path="M4 4h12a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2z" />;
const CardIcon = () => <Icon className="form-input-icon" path="M2 6h16v2H2zm0 4h16v8H2z" />;

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
        <div className="auth-page">
            <div className="auth-card scrollable-card">
                <div className="auth-brand-panel">
                    <h2>BANKIFY</h2>
                    <p>Create your account to get started.</p>
                    <svg className="brand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                </div>

                <div className="auth-form-panel">
                    <button
                        type="button"
                        aria-label="Close"
                        className="auth-modal-close-btn"
                        onClick={() => navigate('/')}
                    >
                        &times;
                    </button>

                    <h3>Sign up</h3>
                    <p className="form-subtitle">It’s fast and easy.</p>

                    {errorMsg && <p className="form-error">{errorMsg}</p>}
                    {successMsg && <p className="form-success">{successMsg}</p>}

                    <form onSubmit={onSubmit}>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <UserIcon />
                                <input type="text" name="firstName" placeholder="First Name" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <UserIcon />
                                <input type="text" name="lastName" placeholder="Last Name" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <UsernameIcon />
                                <input type="text" name="username" placeholder="Username" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <EmailIcon />
                                <input type="email" name="email" placeholder="Email Address" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <PhoneIcon />
                                <input type="tel" name="phoneNumber" placeholder="Phone Number" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <PanIcon />
                                <input type="text" name="panNumber" placeholder="PAN Number" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <CardIcon />
                                <input
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Account Number (e.g., BKSV1234567)"
                                    required
                                    value={formData.accountNumber}
                                    className="form-input"
                                    onChange={handleChange}
                                />
                            </div>
                            <small className="input-hint">
                                Must start with <strong>BK</strong>, then <strong>SV</strong> or <strong>CR</strong>, followed by <strong>7 digits</strong>.
                            </small>
                        </div>
                        <div className="form-input-group">
                            <div className="input-with-icon">
                                <LockIcon />
                                <input type="password" name="password" placeholder="Password" required className="form-input" onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="form-button">Create Account</button>
                    </form>

                    <p className="form-switch-text">
                        Already have an account?{' '}
                        <Link to="/login" className="form-switch-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;