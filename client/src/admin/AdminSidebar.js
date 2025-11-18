import React from "react";
import { NavLink } from "react-router-dom";
import "./styles/AdminSidebar.css";

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">
            <h2 className="admin-logo">BANKIFY Admin</h2>

            <nav className="admin-nav">
                <NavLink to="/admin" end>Dashboard</NavLink>
                <NavLink to="/admin/approve-cards">Approve Cards</NavLink>
                <NavLink to="/admin/approve-loans">Approve Loans</NavLink>
                <NavLink to="/admin/bank-funds">Bank Funds</NavLink>

                <div className="admin-subtitle">History</div>
                <NavLink to="/admin/history/cards">Cards History</NavLink>
                <NavLink to="/admin/history/loans">Loans History</NavLink>
            </nav>

            <div className="admin-footer">
                <NavLink to="/logout">Logout</NavLink>
            </div>
        </div>
    );
};

export default AdminSidebar;