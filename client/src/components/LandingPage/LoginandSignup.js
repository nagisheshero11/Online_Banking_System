import React, { useState } from 'react';
import './styles/LoginandSignup.css'; // Import the new CSS file

// A simple Icon component for reusability
const Icon = ({ path, className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

const UserIcon = () => <Icon className="form-input-icon" path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />;
const EmailIcon = () => <Icon className="form-input-icon" path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />;
const LockIcon = () => <Icon className="form-input-icon" path="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />;
const PhoneIcon = () => <Icon className="form-input-icon" path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  if (!isOpen) return null;

  const handleSwitchView = (e) => {
    e.preventDefault();
    setIsLoginView(!isLoginView);
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div onClick={onClose} className="auth-modal-backdrop">
      <div onClick={stopPropagation} className="auth-modal-content">
        {/* Left Branding Panel */}
        <div className="auth-modal-brand-panel">
            <h2>BANKIFY</h2>
            <p>Banking Made Simple, Secure & Smart.</p>
            <svg className="brand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>

        {/* Right Form Panel */}
        <div className="auth-modal-form-panel">
          <button onClick={onClose} className="auth-modal-close-btn">&times;</button>

          {isLoginView ? (
            // Login Form
            <div>
              <h3>Welcome Back!</h3>
              <p className="form-subtitle">Please enter your details to sign in.</p>
              
              <form>
                <div className="form-input-group">
                    <EmailIcon />
                    <input type="email" placeholder="Email / Username" className="form-input" />
                </div>
                <div className="form-input-group">
                    <LockIcon />
                    <input type="password" placeholder="Password" className="form-input" />
                </div>
                <button className="form-button">Sign In</button>
              </form>

              <p className="form-switch-text">
                Don't have an account? <a href="#" onClick={handleSwitchView} className="form-switch-link">Register Now</a>
              </p>
            </div>
          ) : (
            // Signup Form
            <div>
              <h3>Create Your Account</h3>
              <p className="form-subtitle">Let's get you started!</p>
              
              <form>
                <div className="form-input-group">
                    <UserIcon />
                    <input type="text" placeholder="Full Name" className="form-input" />
                </div>
                <div className="form-input-group">
                    <EmailIcon />
                    <input type="email" placeholder="Email Address" className="form-input" />
                </div>
                 <div className="form-input-group">
                    <PhoneIcon />
                    <input type="tel" placeholder="Phone Number (optional)" className="form-input" />
                </div>
                <div className="form-input-group">
                    <LockIcon />
                    <input type="password" placeholder="Password" className="form-input" />
                </div>
                <button className="form-button">Create Account</button>
              </form>

              <p className="form-switch-text">
                Already have an account? <a href="#" onClick={handleSwitchView} className="form-switch-link">Sign In</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;