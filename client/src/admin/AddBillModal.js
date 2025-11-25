import React, { useState } from "react";
import { createBill } from "./services/adminBillAPI";
import { FaTimes, FaMoneyBillWave } from "react-icons/fa";
import "./styles/UserManagement.css"; // Reuse or add styles here

const AddBillModal = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        amount: "",
        billType: "Electricity",
        dueDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createBill({
                username: user.username,
                accountNumber: user.accountNumber,
                amount: Number(formData.amount),
                dueDate: formData.dueDate,
                billType: formData.billType,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaMoneyBillWave style={{ color: '#0F172A' }} /> Add Bill
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                        <FaTimes />
                    </button>
                </div>

                <div style={{ marginBottom: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <div><strong>User:</strong> {user.fullName} (@{user.username})</div>
                    <div><strong>Account:</strong> {user.accountNumber}</div>
                </div>

                {error && <div className="error-message" style={{ marginBottom: '16px', color: 'red' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">Bill Type</label>
                        <select
                            name="billType"
                            value={formData.billType}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="Electricity">Electricity</option>
                            <option value="Internet">Internet</option>
                            <option value="Mobile Postpaid">Mobile Postpaid</option>
                            <option value="Gas">Gas</option>
                            <option value="Water">Water</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. 1500"
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="confirm-btn" disabled={loading}>
                            {loading ? "Creating..." : "Create Bill"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBillModal;
