import React from 'react';
import { FaUserPlus, FaTachometerAlt, FaMoneyCheckAlt } from 'react-icons/fa';
import './styles/HowItWorksSection.css';

import bentoPerson from '../../assets/bento_person.jpg';

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="how-it-works-container">
                <div className="bento-grid">
                    {/* Card 1: Total Balance (Large, Top Right in reference, but adapting for flow) */}
                    <div className="bento-card balance-card">
                        <div className="card-header">
                            <span>Total Balance</span>
                            <div className="user-avatar"></div>
                        </div>
                        <div className="balance-amount">$ 51,200</div>
                        <div className="income-badge">INCOME ▼</div>
                        <div className="chart-placeholder">
                            <svg viewBox="0 0 100 50" className="chart-line" preserveAspectRatio="none">
                                <path d="M-5,45 Q20,45 35,25 T65,35 T90,10 T110,25" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="card-floating-badge">$51200</div>
                    </div>

                    {/* Card 2: Full Consultation (Center Text) */}
                    <div className="bento-text-content">
                        <h2 className="bento-title">Full Consultation</h2>
                        <p className="bento-subtitle">Best managers for your financial growth.</p>
                    </div>

                    {/* Card 3: Your Cards (Bottom Left) */}
                    <div className="bento-card cards-preview-card">
                        <div className="card-header-simple">
                            <span>Your cards</span>
                            <span>•••</span>
                        </div>
                        <div className="preview-card-visual">
                            <div className="visual-card-content">
                                <div className="vc-balance">₹ 23,892</div>
                                <div className="vc-number">**** **** **** 1456</div>
                                <div className="vc-chart-donut">
                                    <div className="donut-text">39%<br /><span>Limit spent</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-stats-row">
                            <div>
                                <span className="stat-label">INCOME</span>
                                <span className="stat-val">₹ 2 620</span>
                            </div>
                            <div>
                                <span className="stat-label">SPENT</span>
                                <span className="stat-val">₹ 6 830</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Expenses (Small Floating) */}
                    <div className="bento-card expenses-card">
                        <div className="expense-icon">↓</div>
                        <div className="expense-info">
                            <span className="expense-label">Expenses</span>
                            <span className="expense-amount">₹240.00</span>
                        </div>
                    </div>

                    {/* Card 5: Image Placeholder (Person with Laptop) */}
                    <div className="bento-card image-card">
                        <img src={bentoPerson} alt="Happy user with laptop" className="bento-image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;