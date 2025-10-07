import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaExchangeAlt, FaFileInvoiceDollar, FaMoneyCheckAlt, FaCog, FaCreditCard, FaUserCircle, FaListAlt, FaArrowDown, FaPaperPlane, FaSuitcase } from 'react-icons/fa';
import './styles/Sidebar.css';

const NavItem = ({ icon: Icon, label, to, active }) => {
    const Item = (
        <div className={`sidebar-item ${active ? 'active' : ''}`}>
            <span className="icon-wrap"><Icon /></span>
            <span className="sidebar-label">{label}</span>
        </div>
    );
    if (to) {
        // Use NavLink so active class is applied based on current route
        return (
            <NavLink
                to={to}
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
                {({ isActive }) => (
                    <div className={`sidebar-item ${isActive || active ? 'active' : ''}`}>
                        <span className="icon-wrap"><Icon /></span>
                        <span className="sidebar-label">{label}</span>
                    </div>
                )}
            </NavLink>
        );
    }
    return Item;
};

const Sidebar = () => {
    return (
        <nav className="sidebar" aria-label="Sidebar">
            <div className="sidebar-section">
                <NavItem icon={FaTachometerAlt} label="Dashboard" to="/dashboard" />
                <NavItem icon={FaUser} label="Account Details" />
                <NavItem icon={FaListAlt} label="Transactions" />
                <NavItem icon={FaArrowDown} label="Deposit Money" />
                <NavItem icon={FaPaperPlane} label="Transfer Money" />
                <NavItem icon={FaFileInvoiceDollar} label="Pay Bills" />
                <NavItem icon={FaSuitcase} label="Request Loan" />
                <NavItem icon={FaMoneyCheckAlt} label="Loan Status" />
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-link">
                    <div className="sidebar-item">
                        <span className="icon-wrap"><FaUserCircle /></span>
                        <span className="sidebar-label">Profile</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
