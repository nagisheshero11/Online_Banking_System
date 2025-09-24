import React, { useEffect, useState } from 'react';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';

// Simple modal wrapper that shows either the Login or Signup component.
// Navbar expects a default export named AuthModal (imported as default).
const AuthModal = ({ isOpen, onClose, defaultView = 'login' }) => {
    const [view, setView] = useState(defaultView);

    useEffect(() => {
        setView(defaultView);
    }, [defaultView, isOpen]);

    if (!isOpen) return null;

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0 }}>{view === 'login' ? 'Sign in' : 'Create account'}</h3>
                    <button aria-label="Close" onClick={onClose} style={closeButtonStyle}>×</button>
                </div>

                <div style={switchStyle}>
                    <button
                        onClick={() => setView('login')}
                        style={view === 'login' ? activeSwitchButtonStyle : switchButtonStyle}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setView('signup')}
                        style={view === 'signup' ? activeSwitchButtonStyle : switchButtonStyle}
                    >
                        Sign up
                    </button>
                </div>

                <div>
                    {view === 'login' ? <Login /> : <Signup />}
                </div>
            </div>
        </div>
    );
};

// Minimal inline styles to avoid adding a CSS file.
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
};

const modalStyle = {
    width: '900px',
    maxWidth: '95%',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
};

const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    lineHeight: 1,
};

const switchStyle = {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: '1px solid #f4f4f4',
};

const switchButtonStyle = {
    padding: '8px 12px',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
};

const activeSwitchButtonStyle = {
    ...switchButtonStyle,
    background: '#0d6efd',
    color: '#fff',
    borderColor: '#0d6efd',
};

export default AuthModal;
