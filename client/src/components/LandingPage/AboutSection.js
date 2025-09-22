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

                    <div className="about-image">
                        <img
                            src={heroImage}
                            alt="About Banking Platform"
                            className="about-img"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;