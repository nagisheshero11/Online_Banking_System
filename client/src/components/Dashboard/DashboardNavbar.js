import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import './styles/DashboardNavbar.css';
import { getUserProfile } from '../../services/profileAPI';
import { logout } from '../../services/authAPI';

const DashboardNavbar = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        accountNumber: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setUserData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    accountNumber: data.accountNumber || '',
                });
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const displayName = loading
        ? 'Loading...'
        : `${userData.firstName} ${userData.lastName}`;

    // Initials for Avatar
    const initials = userData.firstName && userData.lastName
        ? `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
        : 'U';

    return (
        <div className="dashboard-navbar">
            {/* Left Section */}
            <div className="nav-left">
                <div className="brand">
                    <img
                        src="/logo-money.png"
                        alt="Logo"
                        className="brand-logo"
                    />
                    <div className="brand-text">BANKIFY</div>
                </div>
            </div>

            {/* Right Section */}
            <div className="nav-right">
                <div className="user-profile-section">
                    <div className="nav-avatar-circle">
                        {initials}
                    </div>
                    <span className="user-name-strong">
                        {displayName}
                    </span>
                </div>

                <div className="nav-divider"></div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardNavbar;