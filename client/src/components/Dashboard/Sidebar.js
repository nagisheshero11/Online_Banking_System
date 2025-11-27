import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUser,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaUserCircle,
  FaListAlt,
  FaArrowDown,
  FaPaperPlane,
  FaSuitcase,
  FaIdCard,
  FaCreditCard,
  FaHandHoldingUsd
} from 'react-icons/fa';
import './styles/Sidebar.css';

const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
  >
    {({ isActive }) => (
      <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
        <span className="icon-wrap"><Icon /></span>
        <span className="sidebar-label">{label}</span>
      </div>
    )}
  </NavLink>
);

const Sidebar = () => {
  return (
    <nav className="sidebar" aria-label="Sidebar">
      <div className="sidebar-section">

        {/* Dashboard Main Section (Dashboard removed) */}

        {/* Account and Transactions */}
        <NavItem icon={FaUser} label="Account Details" to="/dashboard/account-details" />
        <NavItem icon={FaListAlt} label="Transactions" to="/dashboard/transactions" />

        {/* Banking Actions */}
        {/* Banking Actions */}
        <NavItem icon={FaPaperPlane} label="Transfer Money" to="/dashboard/transfer-money" />
        <NavItem icon={FaFileInvoiceDollar} label="Pay Bills" to="/dashboard/pay-bills" />
        <NavItem icon={FaCreditCard} label="Cards" to="/dashboard/cards" />

        {/* Loan Services */}
        <NavItem icon={FaHandHoldingUsd} label="Request Loan" to="/dashboard/request-loan" />
        <NavItem icon={FaMoneyCheckAlt} label="Loan Status" to="/dashboard/loan-status" />

      </div>

      {/* Profile Section */}
      <div className="sidebar-footer">
        <Link to="/dashboard/profile" className="sidebar-link">
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
