import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { FaShieldAlt, FaLightbulb, FaUsers, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './styles/ContactSection.css';

const ContactSection = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <div className="contact-info">
                    <h3>Contact Us</h3>
                    <div className="contact-item">
                        <div className="contact-icon">
                            <FaEnvelope />
                        </div>
                        <span>support@bankify.com</span>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">
                            <FaPhone />
                        </div>
                        <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">
                            <FaMapMarkerAlt />
                        </div>
                        <span>123 Banking St, Finance City, FC 12345</span>
                    </div>
                </div>

                <div className="mission-section">
                    <h3>About Us</h3>
                    <p className="mission-text">
                        BANKIFY is a modern banking platform designed to make financial services simple and accessible. We provide secure account management, instant transfers, and convenient bill payments all in one place.
                    </p>
                    <p className="ready-text">Start your banking journey with us today!</p>
                    <RouterLink to="/signup" className="cta-button" style={{ marginTop: '1rem', display: 'inline-block' }}>
                        Create Account Now
                    </RouterLink>
                </div>

                <div className="why-choose-section">
                    <h3>Why Choose Us?</h3>
                    <div className="why-item">
                        <div className="why-icon">
                            <FaShieldAlt />
                        </div>
                        <span>Secure (JWT + encryption)</span>
                    </div>
                    <div className="why-item">
                        <div className="why-icon">
                            <FaLightbulb />
                        </div>
                        <span>Simple (Clean UI)</span>
                    </div>
                    <div className="why-item">
                        <div className="why-icon">
                            <FaUsers />
                        </div>
                        <span>Reliable (Simulated for learning/demo use)</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;