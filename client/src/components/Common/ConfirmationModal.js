import React from 'react';
import './ConfirmationModal.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal-content">
                <div className="confirmation-modal-header">
                    <FaExclamationTriangle className="confirmation-icon" />
                    <h3>{title}</h3>
                </div>
                <div className="confirmation-modal-body">
                    <p>{message}</p>
                </div>
                <div className="confirmation-modal-actions">
                    <button className="confirmation-btn-cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={`confirmation-btn-confirm ${isDangerous ? 'dangerous' : ''}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
