import React from 'react';
import { FaUserCircle, FaExchangeAlt, FaFileInvoiceDollar, FaHandHoldingUsd } from 'react-icons/fa';
import './styles/FeaturesSection.css';

const FeaturesSection = () => {
    return (
        <section id="features" className="features-section">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-title">Features</h2>
                    <p className="features-subtitle">
                        Discover powerful banking tools designed to make your financial life easier and more secure.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaUserCircle />
                        </div>
                        <h3 className="feature-title">Account Management</h3>
                        <p className="feature-description">
                            Open and manage multiple accounts effortlessly. Monitor your balance, view transaction history, and get detailed statements.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaExchangeAlt />
                        </div>
                        <h3 className="feature-title">Fund Transfers</h3>
                        <p className="feature-description">
                            Send and receive money instantly and securely. Transfer funds between accounts or to other users with just a few clicks.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaFileInvoiceDollar />
                        </div>
                        <h3 className="feature-title">Bill Payments</h3>
                        <p className="feature-description">
                            Pay utility bills and set up recurring payments. Never miss a deadline with automated payment scheduling.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaHandHoldingUsd />
                        </div>
                        <h3 className="feature-title">Loan Requests</h3>
                        <p className="feature-description">
                            Apply for loans and track approval status. Get competitive rates and quick processing for your financial needs.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;