import React, { useEffect, useState } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { transferMoney, getAccountDetails } from '../../services/accountAPI';
import './styles/TransferMoney.css';

const AccountTransfer = () => {
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
        <div className="transfer-content-wrapper">
            <div className="transfer-header">
                <h2>Bank Transfer</h2>
                <p>Send money directly to any bank account.</p>
            </div>

            <div className="balance-banner">
                <span>Available Balance</span>
                <h3>{currency(availableBalance)}</h3>
            </div>

            <form onSubmit={handleTransfer} className="transfer-form">
                <div className="form-group">
                    <label>Receiver Account Number</label>
                    <input
                        type="text"
                        className="form-input"
                        value={receiverAccount}
                        onChange={(e) => setReceiverAccount(e.target.value.toUpperCase())}
                        placeholder="e.g. BANK12345678"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Amount (INR)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Remarks (Optional)</label>
                    <input
                        type="text"
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this for?"
                    />
                </div>

                <button type="submit" className="action-btn" disabled={loading}>
                    {loading ? "Processing..." : (success ? "Transfer Successful!" : "Send Money")}
                    {!loading && !success && <FaPaperPlane />}
                    {success && <FaCheckCircle />}
                </button>

                {success && <div className="success-msg">{success}</div>}
            </form>
        </div>
    );
};

export default AccountTransfer;
