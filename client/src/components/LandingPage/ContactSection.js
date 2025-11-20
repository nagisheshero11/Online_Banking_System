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
                </div>

                <div className="mission-section">
                    <h3>Ready to get started?</h3>
                    <p className="mission-text">
                        Join millions of users who trust Bankify for their financial needs. Sign up today and experience the difference.
                    </p>
                    <RouterLink to="/signup" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                        Sign Up Now
                    </RouterLink>
                </div>

                <div className="why-choose-section">
                    <h3>Security</h3>
                    <div className="why-item">
                        <div className="why-icon">
                            <FaShieldAlt />
                        </div>
                        <span>Bank-grade encryption</span>
                    </div>
                    <div className="why-item">
                        <div className="why-icon">
                            <FaLightbulb />
                        </div>
                        <span>24/7 Fraud monitoring</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;