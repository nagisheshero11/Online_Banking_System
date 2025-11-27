import React, { useEffect, useState } from "react";
import AddBillModal from "./AddBillModal";
import { getAllUsers } from "./services/userAPI";
import { FaSearch, FaUserCircle, FaMoneyBillWave, FaIdCard } from "react-icons/fa";
import "./styles/UserManagement.css";

import { useToast } from '../context/ToastContext';

const UserManagement = () => {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedUserForBill, setSelectedUserForBill] = useState(null); // For Add Bill Modal

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch users when search term changes
    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers(debouncedSearch);
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => n?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || "₹0.00";

    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">User Management</h1>
                <p className="admin-page-subtitle">View and manage all registered users.</p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by username, email, or account number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Users Table */}
            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="empty-state">No users found matching "{debouncedSearch}"</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Account Details</th>
                                <th>Balance</th>
                                <th>Role</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                <FaUserCircle />
                                            </div>
                                            <div className="user-info">
                                                <div className="user-name">{user.fullName}</div>
                                                <div className="user-username">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <div>{user.email}</div>
                                            <div className="phone-text">{user.phoneNumber}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="account-info">
                                            <div className="acc-number">AC: {user.accountNumber}</div>
                                            <div className="acc-type badge">{user.accountType}</div>
                                            <div className="pan-text">PAN: {user.panNumber}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="balance-text">
                                            {currency(user.balance)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => setSelectedUserForBill(user)}
                                            style={{
                                                background: '#0F172A', color: 'white', border: 'none',
                                                padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600'
                                            }}
                                        >
                                            <FaMoneyBillWave /> Add Bill
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Bill Modal */}
            {selectedUserForBill && (
                <AddBillModal
                    user={selectedUserForBill}
                    onClose={() => setSelectedUserForBill(null)}
                    onSuccess={() => {
                        showToast("Bill created successfully!", 'success');
                    }}
                />
            )}
        </div>
    );
};

export default UserManagement;
