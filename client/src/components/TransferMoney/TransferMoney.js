import React, { useState } from 'react';
import { FaUniversity, FaCreditCard, FaQrcode } from 'react-icons/fa';
import AccountTransfer from './AccountTransfer';
import CardTransfer from './CardTransfer';
import UPITransfer from './UPITransfer';
import './styles/TransferMoney.css';

const TransferMoney = () => {
    const [activeTab, setActiveTab] = useState('ACCOUNT'); // ACCOUNT | CARD | UPI

    return (
        <div className="transfer-layout">
            {/* Sidebar / Tabs */}
            <div className="transfer-sidebar">
                <div className="sidebar-header">
                    <h2>Transfer Money</h2>
                    <p>Choose a payment method</p>
                </div>

                <div className="sidebar-menu">
                    <button
                        className={`menu-item ${activeTab === 'ACCOUNT' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ACCOUNT')}
                    >
                        <FaUniversity className="menu-icon" />
                        <div className="menu-text">
                            <span>Bank Account</span>
                            <small>Direct bank transfer</small>
                        </div>
                    </button>

                    <button
                        className={`menu-item ${activeTab === 'CARD' ? 'active' : ''}`}
                        onClick={() => setActiveTab('CARD')}
                    >
                        <FaCreditCard className="menu-icon" />
                        <div className="menu-text">
                            <span>Card Payment</span>
                            <small>Credit or Debit Card</small>
                        </div>
                    </button>

                    <button
                        className={`menu-item ${activeTab === 'UPI' ? 'active' : ''}`}
                        onClick={() => setActiveTab('UPI')}
                    >
                        <FaQrcode className="menu-icon" />
                        <div className="menu-text">
                            <span>UPI Payment</span>
                            <small>Scan QR Code</small>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="transfer-main">
                {activeTab === 'ACCOUNT' && <AccountTransfer />}
                {activeTab === 'CARD' && <CardTransfer />}
                {activeTab === 'UPI' && <UPITransfer />}
            </div>
        </div>
    );
};

export default TransferMoney;
