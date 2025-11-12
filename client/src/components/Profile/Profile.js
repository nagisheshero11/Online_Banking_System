import React, { useState, useEffect } from 'react';
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCreditCard,
    FaCalendarAlt,
    FaSave,
    FaPen,
    FaIdCard
} from 'react-icons/fa';
import './styles/Profile.css';
import { fetchUserProfile, updateUserProfile } from '../../services/profileAPI'; // ✅ Import backend API

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
        <div className="profile-detail-item">
            <label className="detail-label">
                <Icon className="detail-icon" />
                {label}
            </label>
            <div
                className={`detail-input-wrap ${highlight ? 'highlight-green' : ''} ${isEditable ? 'editable' : ''}`}
            >
                <input
                    type="text"
                    value={value || ''}
                    readOnly={!isEditable}
                    className="detail-input"
                    onChange={onValueChange ? (e) => onValueChange(name, e.target.value) : undefined}
                />
                {readOnly && label === 'Email Address' && (
                    <span className="read-only-text">Email cannot be changed</span>
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

    // ✅ Fetch user profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setFormData(data);
            } catch (error) {
                alert(error.message || 'Failed to load profile');
                // window.location.href = '/login'; // Redirect if token invalid
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
            alert('Profile updated successfully!');
            setFormData(updated);
            setIsEditing(false);
        } catch (error) {
            alert(error.message || 'Error updating profile');
        }
    };

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }

    if (!formData) {
        return <div className="profile-error">Failed to load profile data.</div>;
    }

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="page-header-wrapper">
                <div className="page-header">
                    {/* <h1 className="header-title">Profile</h1> */}
                    <p className="header-subtitle">Manage your personal and account details</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="profile-card card">
                {/* Header Section */}
                <div className="profile-header-card">
                    <FaUser className="user-avatar" />
                    <div className="user-info">
                        <h2 className="user-name">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <p className="account-type">User ID: {formData.username}</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="profile-details-grid">
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
                        label="Account Created"
                        value={formData.createdAt?.split('T')[0]} // trim timestamp
                        readOnly={true}
                    />
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    {isEditing ? (
                        <button className="btn-edit btn-save" onClick={handleSaveClick}>
                            <FaSave className="button-icon" />
                            Save Changes
                        </button>
                    ) : (
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>
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