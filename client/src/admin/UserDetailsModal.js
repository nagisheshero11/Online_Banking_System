import React from "react";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaIdCard, FaUniversity, FaCalendarAlt } from "react-icons/fa";
import "./styles/UserManagement.css"; // Reuse styles

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    const currency = (n) => n?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || "₹0.00";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>User Details</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="user-details-body">
                    {/* Header Section */}
                    <div className="user-profile-header">
                        <div className="user-avatar-large">
                            <FaUser />
                        </div>
                        <div className="user-profile-info">
                            <h2>{user.fullName}</h2>
                            <p className="username">@{user.username}</p>
                            <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                        </div>
                    </div>

                    <div className="details-grid">
                        {/* Contact Info */}
                        <div className="detail-section">
                            <h4>Contact Information</h4>
                            <div className="detail-item">
                                <FaEnvelope className="detail-icon" />
                                <div>
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FaPhone className="detail-icon" />
                                <div>
                                    <label>Phone</label>
                                    <p>{user.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="detail-section">
                            <h4>Account Details</h4>
                            <div className="detail-item">
                                <FaUniversity className="detail-icon" />
                                <div>
                                    <label>Account Number</label>
                                    <p>{user.accountNumber}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FaIdCard className="detail-icon" />
                                <div>
                                    <label>PAN Number</label>
                                    <p>{user.panNumber}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FaCalendarAlt className="detail-icon" />
                                <div>
                                    <label>Joined On</label>
                                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Balance Section */}
                    <div className="balance-section">
                        <label>Current Balance</label>
                        <div className="balance-amount">{currency(user.balance)}</div>
                        <div className="account-type-badge">{user.accountType} Account</div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="confirm-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
