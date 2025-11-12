import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import './styles/DashboardNavbar.css';
import { getUserProfile } from '../../services/profileAPI'; // ✅ Fetch user profile data
import { logout } from '../../services/authAPI'; // ✅ Token removal

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
        logout(); // clears token
        window.location.href = '/'; // redirect to homepage
    };

    const displayName = loading
        ? 'Loading...'
        : `${userData.firstName} ${userData.lastName}`;
    const displayAcc = loading ? '' : userData.accountNumber;

    const initial = userData.firstName
        ? userData.firstName.charAt(0).toUpperCase()
        : 'U';

    return (
        <div className="dashboard-navbar">
            {/* Left Section */}
            <div className="nav-left">
                <div className="brand">
                    <div className="brand-logo-mini">B</div>
                    <div className="brand-text">BANKIFY</div>
                </div>
            </div>

            {/* Right Section */}
            <div className="nav-right">
                <div className="user-stack">
                    <span className="user-name-strong">
                        {displayName}
                    </span>
                    {displayAcc && (
                        <span className="user-sub">{displayAcc}</span>
                    )}
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardNavbar;