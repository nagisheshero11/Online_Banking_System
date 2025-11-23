import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { getAccountDetails, depositAmount as apiDeposit } from '../../services/accountAPI';
import './styles/DepositMoney.css';

const DepositMoney = () => {
    const [amount, setAmount] = useState('');
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const quickAmounts = [500, 1000, 5000, 10000];

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        try {
            const data = await getAccountDetails();
            setAccount(data);
        } catch (error) {
            console.error("Failed to fetch account", error);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setLoading(true);
        try {
            // Simulate API call or use real one if available
            // In a real app: await apiDeposit(parseFloat(amount));
            // For now, we'll simulate a success after 1.5s
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess(`Successfully deposited ₹${parseFloat(amount).toLocaleString()}`);
            setAmount('');
            fetchAccount(); // Refresh balance

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            alert("Deposit failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => n ? n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '₹0.00';

    return (
        <div className="deposit-container">
            {/* Left: Visual Guide */}
            <div className="deposit-visual">
                <div className="visual-bg"></div>
                <div className="visual-orb"></div>

                <div className="visual-content">
                    <div>
                        <div className="visual-title">Add Funds<br />Instantly</div>
                        <div className="visual-subtitle">Secure transfers from any linked bank.</div>

                        <div className="current-balance-card">
                            <div className="balance-label">Current Balance</div>
                            <div className="balance-value">{account ? currency(account.balance) : 'Loading...'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Input Form */}
            <div className="deposit-form-card">
                <div className="form-header">
                    <div className="form-title">Deposit Amount</div>
                    <div className="form-desc">Enter the amount you wish to add to your wallet.</div>
                </div>

                <form onSubmit={handleDeposit}>
                    <div className="amount-group">
                        <label className="amount-label">Amount (INR)</label>
                        <div className="amount-wrapper">
                            <span className="currency-sign">₹</span>
                            <input
                                type="number"
                                className="big-amount-input"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="quick-chips">
                        {quickAmounts.map(val => (
                            <button
                                key={val}
                                type="button"
                                className={`chip-btn ${parseInt(amount) === val ? 'active' : ''}`}
                                onClick={() => setAmount(val.toString())}
                            >
                                + ₹{val.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="deposit-submit-btn"
                        disabled={loading || !amount}
                    >
                        {loading ? 'Processing...' : (success ? 'Success!' : 'Confirm Deposit')}
                        {!loading && !success && <FaArrowRight />}
                        {success && <FaCheckCircle />}
                    </button>

                    {success && <div style={{ textAlign: 'center', marginTop: '15px', color: '#16A34A', fontWeight: '600' }}>{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default DepositMoney;