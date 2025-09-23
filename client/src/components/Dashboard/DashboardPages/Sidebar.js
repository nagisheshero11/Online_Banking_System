import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaExchangeAlt, FaFileInvoiceDollar, FaMoneyCheckAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './styles/Sidebar.css';

const NavItem = ({ icon: Icon, label, to, active }) => {
    const content = (
        <div className={`sidebar-item ${active ? 'active' : ''}`}>
            <span className="sidebar-icon"><Icon /></span>
            <span className="sidebar-label">{label}</span>
        </div>
    );
    return to ? <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link> : content;
};

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">B</div>
                <div className="brand-text">BANKIFY</div>
            </div>

            <nav className="sidebar-nav">
                <NavItem icon={FaTachometerAlt} label="Dashboard" active />
                <NavItem icon={FaUser} label="Accounts" />
                <NavItem icon={FaExchangeAlt} label="Transfers" />
                <NavItem icon={FaFileInvoiceDollar} label="Bills" />
                <NavItem icon={FaMoneyCheckAlt} label="Loans" />
                <NavItem icon={FaCog} label="Settings" />
            </nav>

            <div className="sidebar-footer">
                <NavItem icon={FaSignOutAlt} label="Logout" to="/logout" />
            </div>
        </div>
    );
};

export default Sidebar;
