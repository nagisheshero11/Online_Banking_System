// client/src/components/Dashboard/DashboardPages/Sidebar.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
// Keep only the icons used in the NavItem components
import { FaTachometerAlt, FaUser, FaFileInvoiceDollar, FaMoneyCheckAlt, FaUserCircle, FaListAlt, FaArrowDown, FaPaperPlane, FaSuitcase } from 'react-icons/fa';
import './styles/Sidebar.css';

// ... rest of the code ...

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
                
                <NavItem icon={FaUser} label="Account Details" to="/dashboard/account-details" />
                
                <NavItem icon={FaListAlt} label="Transactions" to="/transactions" />
                
                <NavItem icon={FaArrowDown} label="Deposit Money" to="/deposit-money" />
                
                <NavItem icon={FaPaperPlane} label="Transfer Money" to="/transfer-money" />
                
                <NavItem icon={FaFileInvoiceDollar} label="Pay Bills" to="/pay-bills" />
                
                <NavItem icon={FaSuitcase} label="Request Loan" to="/request-loan" />
                
                <NavItem icon={FaMoneyCheckAlt} label="Loan Status" to="/loan-status" />
            </div>

            <div className="sidebar-footer">
                <Link to="/profile" className="sidebar-link">
                    <div className="sidebar-item">
                        <span className="icon-wrap"><FaUserCircle /></span>
                        <span className="sidebar-label">Profile</span>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default Sidebar;