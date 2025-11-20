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
                        <h3 className="feature-title">Manage</h3>
                        <p className="feature-description">
                            Stay on top of your money with our easy-to-use dashboard. Track spending and set budgets.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaExchangeAlt />
                        </div>
                        <h3 className="feature-title">Transfer</h3>
                        <p className="feature-description">
                            Send money to friends and family in seconds. It's fast, secure, and free.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaFileInvoiceDollar />
                        </div>
                        <h3 className="feature-title">Pay Bills</h3>
                        <p className="feature-description">
                            Pay your utilities, rent, and credit cards from one place. Set up auto-pay and never miss a due date.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaHandHoldingUsd />
                        </div>
                        <h3 className="feature-title">Borrow</h3>
                        <p className="feature-description">
                            Need extra cash? Apply for a personal loan with low rates and flexible repayment options.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;