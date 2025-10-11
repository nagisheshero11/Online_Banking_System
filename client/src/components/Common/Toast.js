import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message = '', duration = 2500, onClose, variant = 'info' }) => {
    useEffect(() => {
        const id = setTimeout(() => {
            onClose?.();
        }, duration);
        return () => clearTimeout(id);
    }, [duration, onClose]);

    return (
        <div
            className="toast-root"
            role="status"
            aria-live="polite"
            style={{ '--toast-duration': `${duration}ms` }}
        >
            <div className={`toast ${variant}`}>
                {variant === 'success' && (
                    <span className="toast-icon" aria-hidden="true">✓</span>
                )}
                <span className="toast-text">{message}</span>
                <span className="toast-progress" aria-hidden="true" />
            </div>
        </div>
    );
};

export default Toast;
