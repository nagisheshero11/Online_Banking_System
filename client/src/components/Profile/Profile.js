import React, { useState, useEffect } from 'react';
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCreditCard,
    FaCalendarAlt,
    FaSave,
    FaPen,
    FaIdCard,
    FaCheckCircle
} from 'react-icons/fa';
import './styles/Profile.css';
import { fetchUserProfile, updateUserProfile } from '../../services/profileAPI';

// ✅ Reusable Profile Item Component
const ProfileDetailItem = ({
    icon: Icon,
    label,
    value,
    readOnly = true,
    highlight = false,
    isEditing,
    onValueChange,
    name
}) => {
    const isEditable = isEditing && !readOnly;

    return (
        <div className="zen-profile-item">
            <label className="zen-detail-label">
                <Icon className="zen-detail-icon" />
                {label}
            </label>
            <div
                className={`zen-input-wrap ${highlight ? 'highlight' : ''} ${isEditable ? 'editable' : ''}`}
            >
                <input
                    type="text"
                    value={value || ''}
                    readOnly={!isEditable}
                    className="zen-detail-input"
                    onChange={onValueChange ? (e) => onValueChange(name, e.target.value) : undefined}
                />
                {readOnly && label === 'Email Address' && (
                    <span className="zen-readonly-text">Cannot be changed</span>
                )}
            </div>
        </div>
    );
};

// ✅ Main Profile Component
const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');

    // ✅ Fetch user profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setFormData(data);
            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    // ✅ Handle field updates
    const handleValueChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Save profile updates
    const handleSaveClick = async () => {
        try {
            const updated = await updateUserProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber
            });
            setSuccessMsg('Profile updated successfully!');
            setFormData(updated);
            setIsEditing(false);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            alert(error.message || 'Error updating profile');
        }
    };

    if (loading) {
        return <div className="zen-profile-loading">Loading profile...</div>;
    }

    if (!formData) {
        return <div className="zen-profile-error">Failed to load profile data.</div>;
    }

    return (
        <div className="zen-profile-page">
            {/* Header */}
            <div className="zen-profile-header">
                <h1>My Profile</h1>
                <p>Manage your personal information and account details.</p>
            </div>

            {/* Profile Card */}
            <div className="zen-profile-card">
                {/* User Info Header */}
                <div className="zen-user-header">
                    <div className="zen-avatar-circle">
                        <span className="zen-avatar-initials">
                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </span>
                    </div>
                    <div className="zen-user-info">
                        <h2 className="zen-user-name">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <p className="zen-user-id">User ID: {formData.username}</p>
                    </div>

                    {/* Action Buttons (Desktop) */}
                    <div className="zen-actions-desktop">
                        {isEditing ? (
                            <button className="zen-btn-save" onClick={handleSaveClick}>
                                <FaSave /> Save Changes
                            </button>
                        ) : (
                            <button className="zen-btn-edit" onClick={() => setIsEditing(true)}>
                                <FaPen /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {successMsg && (
                    <div className="zen-success-msg">
                        <FaCheckCircle /> {successMsg}
                    </div>
                )}

                {/* Details Grid */}
                <div className="zen-details-grid">
                    <ProfileDetailItem
                        icon={FaUser}
                        label="First Name"
                        value={formData.firstName}
                        name="firstName"
                        readOnly={false}
                        isEditing={isEditing}
                        onValueChange={handleValueChange}
                    />

                    <ProfileDetailItem
                        icon={FaUser}
                        label="Last Name"
                        value={formData.lastName}
                        name="lastName"
                        readOnly={false}
                        isEditing={isEditing}
                        onValueChange={handleValueChange}
                    />

                    <ProfileDetailItem
                        icon={FaUser}
                        label="Username"
                        value={formData.username}
                        readOnly={true}
                    />

                    <ProfileDetailItem
                        icon={FaEnvelope}
                        label="Email Address"
                        value={formData.email}
                        readOnly={true}
                    />

                    <ProfileDetailItem
                        icon={FaPhone}
                        label="Phone Number"
                        value={formData.phoneNumber}
                        name="phoneNumber"
                        readOnly={!isEditing}
                        isEditing={isEditing}
                        onValueChange={handleValueChange}
                    />

                    <ProfileDetailItem
                        icon={FaIdCard}
                        label="PAN Number"
                        value={formData.panNumber}
                        readOnly={true}
                    />

                    <ProfileDetailItem
                        icon={FaCreditCard}
                        label="Account Number"
                        value={formData.accountNumber}
                        highlight={true}
                        readOnly={true}
                    />

                    <ProfileDetailItem
                        icon={FaCalendarAlt}
                        label="Member Since"
                        value={formData.createdAt?.split('T')[0]}
                        readOnly={true}
                    />
                </div>

                {/* Action Buttons (Mobile) */}
                <div className="zen-actions-mobile">
                    {isEditing ? (
                        <button className="zen-btn-save full-width" onClick={handleSaveClick}>
                            <FaSave /> Save Changes
                        </button>
                    ) : (
                        <button className="zen-btn-edit full-width" onClick={() => setIsEditing(true)}>
                            <FaPen /> Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;