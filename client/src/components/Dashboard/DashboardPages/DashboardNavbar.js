import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import './styles/DashboardNavbar.css';

const DashboardNavbar = ({ userName = 'User', accountId = '' }) => {
    const initial = userName?.charAt(0)?.toUpperCase() || 'U';
    return (
        <div className="dashboard-navbar">
            <div className="nav-left">
                <div className="brand">
                    <div className="brand-logo-mini">B</div>
                    <div className="brand-text">Bankify</div>
                </div>
            </div>
            <div className="nav-right">
                <div className="user-stack">
                    <span className="user-name-strong">{userName}</span>
                    {accountId ? <span className="user-sub">{accountId}</span> : null}
                </div>
                <a className="logout-btn" href="/logout">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </a>
            </div>
        </div>
    );
};

export default DashboardNavbar;
