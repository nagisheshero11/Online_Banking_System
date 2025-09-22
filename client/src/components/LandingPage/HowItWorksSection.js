import React from 'react';
import { FaUserPlus, FaTachometerAlt, FaMoneyCheckAlt } from 'react-icons/fa';
import './styles/HowItWorksSection.css';

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="how-it-works-container">
                <div className="how-it-works-header">
                    <h2 className="how-it-works-title">How It Works</h2>
                    <p className="how-it-works-subtitle">
                        Get started with our banking platform in just three simple steps.
                    </p>
                </div>

                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">
                            1
                            <FaUserPlus className="step-icon" />
                        </div>
                        <h3 className="step-title">Register</h3>
                        <p className="step-description">
                            Create an account in minutes with our simple registration process. Verify your identity securely.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">
                            2
                            <FaTachometerAlt className="step-icon" />
                        </div>
                        <h3 className="step-title">Login & Dashboard</h3>
                        <p className="step-description">
                            Securely access your personalized dashboard with all your banking tools and account information.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">
                            3
                            <FaMoneyCheckAlt className="step-icon" />
                        </div>
                        <h3 className="step-title">Transact</h3>
                        <p className="step-description">
                            Transfer funds, pay bills, request loans, and manage all your banking needs effortlessly.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;