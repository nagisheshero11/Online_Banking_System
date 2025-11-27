import React from "react";
import { NavLink } from "react-router-dom";
import "./styles/AdminSidebar.css";

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">

            <nav className="admin-nav">
                <NavLink to="/admin" end>Dashboard</NavLink>
                <NavLink to="/admin/approve-cards">Approve Cards</NavLink>
                <NavLink to="/admin/approve-loans">Approve Loans</NavLink>
                <NavLink to="/admin/bank-funds" end>Bank Funds</NavLink>
                <NavLink to="/admin/bank-funds/history">Bank Transactions</NavLink>
                <NavLink to="/admin/transactions">User Transactions</NavLink>
                <NavLink to="/admin/users">User Management</NavLink>

                <div className="admin-subtitle">History</div>
                <NavLink to="/admin/history/cards">Cards History</NavLink>
                <NavLink to="/admin/history/loans">Loans History</NavLink>
            </nav>

            {/* Logout moved to Admin Header navbar */}
        </div>
    );
};

export default AdminSidebar;