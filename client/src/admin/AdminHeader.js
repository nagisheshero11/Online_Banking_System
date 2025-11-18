import React from "react";
import { useLocation } from "react-router-dom";
import "./styles/AdminHeader.css";

const routeTitleMap = {
    "/admin": "Admin Dashboard",
    "/admin/approve-loans": "Approve Loans",
    "/admin/approve-cards": "Approve Cards",
    "/admin/history-loans": "Loan History",
    "/admin/history-cards": "Card History",
    "/admin/bank-funds": "Bank Funds",
};

const getTitle = (pathname) => {
    // Exact match first
    if (routeTitleMap[pathname]) return routeTitleMap[pathname];
    // Fallback: find the longest mapping that is a prefix
    const match = Object.keys(routeTitleMap)
        .filter((k) => pathname.startsWith(k))
        .sort((a, b) => b.length - a.length)[0];
    return routeTitleMap[match] || "Admin";
};

const AdminHeader = () => {
    const { pathname } = useLocation();
    const title = getTitle(pathname);

    return (
        <div className="admin-header">
            <h1 className="admin-title">{title}</h1>
        </div>
    );
};

export default AdminHeader;
