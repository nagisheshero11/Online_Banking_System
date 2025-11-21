import React from 'react';
import { FaShieldAlt, FaLightbulb, FaUsers } from 'react-icons/fa';
import heroImage from '../../assets/landing_home_img.png';
import './styles/AboutSection.css';

const AboutSection = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <div className="about-content">
                    <div className="about-text">
                        <h2 className="about-title">Our Mission</h2>
                        <p className="about-description">
                            Our mission is to bring seamless and secure banking to everyone. With modern tech (React, Spring Boot, MySQL), we ensure trust, speed, and simplicity.
                        </p>

                        <div className="why-choose-us">
                            <h3 className="why-choose-title">Why Choose Us?</h3>
                            <div className="benefits-grid">
                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <FaShieldAlt />
                                    </div>
                                    <span className="benefit-text">Secure (JWT + encryption)</span>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <FaLightbulb />
                                    </div>
                                    <span className="benefit-text">Simple (Clean UI)</span>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <FaUsers />
                                    </div>
                                    <span className="benefit-text">Reliable (Simulated for learning/demo)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-visual">
                        <div className="security-card-container">
                            {/* Main Shield Card */}
                            <div className="security-card">
                                <div className="shield-icon-wrapper">
                                    <FaShieldAlt className="shield-icon-large" />
                                </div>
                                <div className="security-status">
                                    <span className="status-dot"></span>
                                    <span className="status-text">System Secure</span>
                                </div>
                                <div className="security-progress">
                                    <div className="progress-bar"></div>
                                </div>
                            </div>

                            {/* Floating Badge 1: Encryption */}
                            <div className="floating-badge badge-encryption">
                                <div className="badge-icon"><FaShieldAlt /></div>
                                <div className="badge-info">
                                    <span className="badge-title">256-bit</span>
                                    <span className="badge-subtitle">Encryption</span>
                                </div>
                            </div>

                            {/* Floating Badge 2: Users */}
                            <div className="floating-badge badge-users">
                                <div className="badge-icon"><FaUsers /></div>
                                <div className="badge-info">
                                    <span className="badge-title">1M+</span>
                                    <span className="badge-subtitle">Trusted Users</span>
                                </div>
                            </div>

                            {/* Floating Badge 3: Speed */}
                            <div className="floating-badge badge-speed">
                                <div className="badge-icon"><FaLightbulb /></div>
                                <div className="badge-info">
                                    <span className="badge-title">Instant</span>
                                    <span className="badge-subtitle">Transactions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;