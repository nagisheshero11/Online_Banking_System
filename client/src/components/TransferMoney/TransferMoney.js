import React, { useEffect, useState } from 'react';
import { FaPaperPlane, FaUser } from 'react-icons/fa';
import { transferMoney, getAccountDetails } from '../../services/accountAPI'; // ✅ new import
import './styles/TransferMoney.css';

const TransferMoney = () => {
    const [receiverAccount, setReceiverAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [description, setDescription] = useState('');
    const [userAccount, setUserAccount] = useState('');
    const [availableBalance, setAvailableBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch account info on mount
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const accountData = await getAccountDetails();
                setUserAccount(accountData.accountNumber);
                setAvailableBalance(accountData.balance);
            } catch (error) {
                console.error('Error fetching account info:', error);
                alert('Failed to load account info. Please log in again.');
            }
        };
        fetchAccount();
    }, []);

    const handleTransfer = async (e) => {
        e.preventDefault();

        // Basic validation
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

        // ✅ Call backend
        setLoading(true);
        try {
            const transferData = {
                toAccountNumber: receiverAccount,
                amount: parseFloat(transferAmount),
                remarks: description || "",
            };

            const response = await transferMoney(transferData);
            alert(
                `✅ Transfer Successful!\nTransaction ID: ${response.transactionId}\nAmount: ₹${response.amount}\nTo: ${response.toAccountNumber}`
            );

            // Update balance locally
            setAvailableBalance(response.fromBalanceAfter);
            // Reset form
            setReceiverAccount('');
            setTransferAmount('');
            setDescription('');
        } catch (error) {
            console.error("Transfer failed:", error);
            const errMsg =
                error.response?.data || "Transfer failed. Please try again.";
            alert(`❌ ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setReceiverAccount('');
        setTransferAmount('');
        setDescription('');
    };

    return (
        <div className="transfer-money-container">
            <div className="transfer-header">
                <p>Send money to any account instantly</p>
            </div>

            <div className="transfer-card">
                <div className="transfer-banner">
                    <div className="banner-content">
                        <FaPaperPlane className="transfer-icon" />
                        <div className="banner-text">
                            <h3>Transfer Funds</h3>
                            <p>
                                Available Balance: ₹
                                {availableBalance
                                    ? availableBalance.toLocaleString()
                                    : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleTransfer} className="transfer-form">
                    {/* Receiver Account */}
                    <div className="form-group">
                        <label htmlFor="receiverAccount" className="form-label">
                            Receiver Account Number *
                        </label>
                        <div className="account-input-container">
                            <FaUser className="account-icon" />
                            <input
                                type="text"
                                id="receiverAccount"
                                value={receiverAccount}
                                onChange={(e) => setReceiverAccount(e.target.value.toUpperCase())}
                                placeholder="Enter receiver's account number"
                                className="account-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label htmlFor="transferAmount" className="form-label">
                            Transfer Amount *
                        </label>
                        <div className="amount-input-container">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                id="transferAmount"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="Enter amount to transfer"
                                className="amount-input"
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description / Remarks (Optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a note for this transfer"
                            className="description-input"
                            rows="3"
                        />
                    </div>

                    {/* Transfer Summary */}
                    <div className="transfer-details">
                        <h4>Transfer Details:</h4>
                        <div className="details-row">
                            <span className="detail-label">From:</span>
                            <span className="detail-value">{userAccount || "Loading..."}</span>
                        </div>
                        <div className="details-row">
                            <span className="detail-label">To:</span>
                            <span className="detail-value">{receiverAccount || "Not entered"}</span>
                        </div>
                        <div className="details-row">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value">
                                ₹{transferAmount ? parseFloat(transferAmount).toLocaleString() : '0.00'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="transfer-btn" disabled={loading}>
                            {loading ? "Processing..." : "Transfer Now"}
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferMoney;
