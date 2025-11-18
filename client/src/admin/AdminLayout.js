import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminNavbar from "./AdminNavbar";
import "./styles/AdminLayout.css";

const AdminLayout = () => {
    return (
        <>
            <AdminNavbar />
            <div className="admin-layout">
                <AdminSidebar />
                <div className="admin-content">
                    <AdminHeader />
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminLayout;