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
    FaLock,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import './styles/Profile.css';
import { fetchUserProfile, updateUserProfile, changePassword } from '../../services/profileAPI';
import { useToast } from '../../context/ToastContext';

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
    const { showToast } = useToast();

    // Password Change State
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // ✅ Fetch user profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setFormData(data);
            } catch (error) {
                console.error('Failed to load profile', error);
                showToast('Failed to load profile data.', 'error');
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
            showToast('Profile updated successfully!', 'success');
            setFormData(updated);
            setIsEditing(false);
        } catch (error) {
            showToast(error.message || 'Error updating profile', 'error');
        }
    };

    // ✅ Handle Password Change
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            showToast('Please fill all password fields.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }

        try {
            await changePassword(oldPassword, newPassword);
            showToast('Password changed successfully!', 'success');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordChange(false);
        } catch (error) {
            showToast(error.message, 'error');
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

            {/* Change Password Section */}
            <div className="zen-profile-card" style={{ marginTop: '20px' }}>
                <div
                    className="zen-user-header"
                    style={{ cursor: 'pointer', borderBottom: showPasswordChange ? '1px solid #E2E8F0' : 'none' }}
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                    <div className="zen-user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="zen-avatar-circle" style={{ width: '40px', height: '40px', fontSize: '1.2rem', background: '#F1F5F9', color: '#64748B' }}>
                            <FaLock />
                        </div>
                        <div>
                            <h3 className="zen-user-name" style={{ fontSize: '1.1rem' }}>Security Settings</h3>
                            <p className="zen-user-id">Change your password</p>
                        </div>
                    </div>
                    <div style={{ color: '#64748B' }}>
                        {showPasswordChange ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>

                {showPasswordChange && (
                    <form onSubmit={submitPasswordChange} style={{ padding: '20px', display: 'grid', gap: '20px', maxWidth: '500px' }}>
                        <div className="zen-profile-item" style={{ border: 'none', padding: 0 }}>
                            <label className="zen-detail-label">Current Password</label>
                            <div className="zen-input-wrap editable">
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="zen-detail-input"
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div className="zen-profile-item" style={{ border: 'none', padding: 0 }}>
                            <label className="zen-detail-label">New Password</label>
                            <div className="zen-input-wrap editable">
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="zen-detail-input"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div className="zen-profile-item" style={{ border: 'none', padding: 0 }}>
                            <label className="zen-detail-label">Confirm New Password</label>
                            <div className="zen-input-wrap editable">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="zen-detail-input"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="zen-btn-save" style={{ justifySelf: 'start' }}>
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;