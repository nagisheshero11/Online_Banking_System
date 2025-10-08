// client/src/components/Profile/Profile.js - UPDATED FOR EDITING

import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaCreditCard, FaCalendarAlt, FaSave, FaPen } from 'react-icons/fa'; // Added FaSave and FaPen
import './styles/Profile.css';

// Reusable component for displaying one label-value pair
const ProfileDetailItem = ({ icon: Icon, label, value, readOnly = true, highlight = false, isEditing, onValueChange, name }) => {
    // Determine if the input should be editable in the current mode
    const isEditable = isEditing && !readOnly;

    return (
        <div className="profile-detail-item">
            <label className="detail-label">
                <Icon className="detail-icon" />
                {label}
            </label>
            <div className={`detail-input-wrap ${highlight ? 'highlight-green' : ''} ${isEditable ? 'editable' : ''}`}>
                <input 
                    type="text" 
                    value={value} 
                    readOnly={!isEditable} // Input is readOnly unless isEditable is true
                    className="detail-input"
                    onChange={onValueChange ? (e) => onValueChange(name, e.target.value) : undefined}
                />
                {readOnly && label === 'Email Address' && <span className="read-only-text">Email cannot be changed</span>}
            </div>
        </div>
    );
};

const Profile = ({ userData = {} }) => {
    // 1. STATE FOR EDIT MODE AND FORM DATA
    const [isEditing, setIsEditing] = useState(false);
    
    // Initial data from props
    const initialUserData = {
        fullName: userData.fullName || "Sravan Kumar",
        accountType: "Savings Account",
        phone: userData.phone || "+91 98765 43210",
        email: userData.email || "sravan@example.com",
        accountNumber: userData.accountNumber || "BANK10012345",
        accountCreated: userData.accountCreated || "2023-05-15",
    };

    // State to hold the data currently being edited
    const [formData, setFormData] = useState(initialUserData);

    // 2. HANDLERS
    const handleValueChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Here you would typically send formData to a backend API to save the changes.
        // For now, we'll just log it and switch back to read mode.
        console.log('Saving profile data:', formData);
        
        // **IMPORTANT:** In a real app, you'd confirm success, then update parent state/store.
        alert(`Profile Saved! New Name: ${formData.fullName}`);
        
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            
            {/* Page Header */}
            <div className="page-header-wrapper">
                <div className="page-header">
                    <h1 className="header-title">Profile Settings</h1>
                    <p className="header-subtitle">Manage your personal information</p>
                </div>
            </div>

            {/* Main Profile Card Container */}
            <div className="profile-card card">
                
                {/* 1. Profile Header Card (Displays current data) */}
                <div className="profile-header-card">
                    <FaUser className="user-avatar" />
                    <div className="user-info">
                        <h2 className="user-name">{formData.fullName}</h2> {/* Uses current form data */}
                        <p className="account-type">{formData.accountType}</p>
                    </div>
                </div>

                {/* 2. Information Grid */}
                <div className="profile-details-grid">
                    
                    {/* Full Name: Editable when isEditing is true */}
                    <ProfileDetailItem 
                        icon={FaUser} 
                        label="Full Name" 
                        value={formData.fullName}
                        name="fullName"
                        readOnly={false} // Make it generally editable
                        isEditing={isEditing}
                        onValueChange={handleValueChange}
                    />
                    
                    {/* Email Address: Always read-only due to design constraint */}
                    <ProfileDetailItem 
                        icon={FaEnvelope} 
                        label="Email Address" 
                        value={formData.email}
                        readOnly={true} 
                    />
                    
                    {/* Phone Number: Read-only */}
                    <ProfileDetailItem 
                        icon={FaPhone} 
                        label="Phone Number" 
                        value={formData.phone}
                        readOnly={true}
                    />
                    
                    {/* Account Number: Read-only */}
                    <ProfileDetailItem 
                        icon={FaCreditCard} 
                        label="Account Number" 
                        value={formData.accountNumber}
                        readOnly={true}
                    />

                    {/* Account Created: Read-only */}
                    <ProfileDetailItem 
                        icon={FaCalendarAlt} 
                        label="Account Created" 
                        value={formData.accountCreated}
                        readOnly={true}
                    />
                    
                    {/* Placeholder to maintain layout */}
                    <div className="profile-detail-item-placeholder"></div>
                </div>

                {/* 3. Action Button (Conditional Rendering) */}
                <div className="profile-actions">
                    {isEditing ? (
                        // SAVE BUTTON VIEW
                        <button className="btn-edit btn-save" onClick={handleSaveClick}>
                            <FaSave className="button-icon" />
                            Save Changes
                        </button>
                    ) : (
                        // EDIT BUTTON VIEW
                        <button className="btn-edit" onClick={handleEditClick}>
                            <FaPen className="button-icon" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;