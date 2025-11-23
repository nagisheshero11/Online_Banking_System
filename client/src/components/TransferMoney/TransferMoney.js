import React, { useEffect, useState } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { transferMoney, getAccountDetails } from '../../services/accountAPI';
import './styles/TransferMoney.css';

const TransferMoney = () => {
    const [receiverAccount, setReceiverAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [description, setDescription] = useState('');
    const [userAccount, setUserAccount] = useState('');
    const [availableBalance, setAvailableBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const accountData = await getAccountDetails();
                setUserAccount(accountData.accountNumber);
                setAvailableBalance(accountData.balance);
            } catch (error) {
                console.error('Error fetching account info:', error);
            }
        };
        fetchAccount();
    }, []);

    const handleTransfer = async (e) => {
        e.preventDefault();

        if (!receiverAccount) {
            alert("Please enter receiver's account number");
            return;
        }
        if (!transferAmount || parseFloat(transferAmount) <= 0) {
            alert("Please enter a valid transfer amount");
            return;
        }
        if (parseFloat(transferAmount) > availableBalance) {
            alert("Insufficient balance for this transfer");
            return;
        }
        if (receiverAccount === userAccount) {
            alert("Cannot transfer to your own account");
            return;
        }

        setLoading(true);
        try {
            const transferData = {
                toAccountNumber: receiverAccount,
                amount: parseFloat(transferAmount),
                remarks: description || "",
            };

            const response = await transferMoney(transferData);
            setSuccess(`Transferred ₹${response.amount} to ${response.toAccountNumber}`);
            setAvailableBalance(response.fromBalanceAfter);
            setReceiverAccount('');
            setTransferAmount('');
            setDescription('');

            setTimeout(() => setSuccess(''), 4000);
        } catch (error) {
            console.error("Transfer failed:", error);
            const errMsg = error.response?.data || "Transfer failed. Please try again.";
            alert(`❌ ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => n ? n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '₹0.00';

    return (
        <div className="transfer-container">
            {/* Left: Visual Guide */}
            <div className="transfer-visual">
                <div className="visual-bg"></div>

                <div className="visual-content">
                    <div>
                        <div className="visual-title">Send Money<br />Securely</div>
                        <div className="visual-subtitle">Instant transfers to any bank account.</div>

                        <div className="current-balance-card">
                            <div className="balance-label">Available Balance</div>
                            <div className="balance-value">{currency(availableBalance)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Input Form */}
            <div className="transfer-form-card">
                <div className="form-header">
                    <div className="form-title">Transfer Details</div>
                    <div className="form-desc">Please verify the receiver's account number carefully.</div>
                </div>

                <form onSubmit={handleTransfer}>
                    {/* Receiver */}
                    <div className="input-group">
                        <label className="input-label">Receiver Account Number</label>
                        <input
                            type="text"
                            className="zen-input"
                            value={receiverAccount}
                            onChange={(e) => setReceiverAccount(e.target.value.toUpperCase())}
                            placeholder="e.g. BANK12345678"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div className="input-group">
                        <label className="input-label">Amount (INR)</label>
                        <div className="amount-wrapper">
                            <span className="currency-sign">₹</span>
                            <input
                                type="number"
                                className="big-amount-input"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="0"
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="input-group">
                        <label className="input-label">Remarks (Optional)</label>
                        <input
                            type="text"
                            className="zen-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this for?"
                        />
                    </div>

                    <button type="submit" className="transfer-submit-btn" disabled={loading}>
                        {loading ? "Processing..." : (success ? "Transfer Successful!" : "Send Securely")}
                        {!loading && !success && <FaPaperPlane />}
                        {success && <FaCheckCircle />}
                    </button>

                    {success && <div style={{ textAlign: 'center', marginTop: '15px', color: '#16A34A', fontWeight: '600' }}>{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default TransferMoney;
