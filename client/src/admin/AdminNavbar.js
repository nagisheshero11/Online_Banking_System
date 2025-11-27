import React from "react";
import { Link } from "react-router-dom";
import "./styles/AdminHeader.css";

const AdminNavbar = () => {
    return (
        <div className="admin-navbar">
            <div className="nav-left">
                <div className="brand">
                    <div className="brand-logo-mini">💳</div>
                    <span className="brand-text">BANKIFY Admin</span>
                </div>
            </div>
            <div className="nav-right">
                <div className="user-stack">
                    <span className="user-name-strong">Admin</span>
                    <span className="user-sub">Console</span>
                </div>
                <Link to="/logout" className="admin-logout-btn" aria-label="Logout">
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default AdminNavbar;
