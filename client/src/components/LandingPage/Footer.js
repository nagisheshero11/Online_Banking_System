import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaShieldAlt, FaLightbulb, FaUsers, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="footer-container">
                {/* Contact blocks merged from ContactSection */}
                <div className="footer-contact-grid">
                    <div className="footer-contact-col">
                        <h3 className="footer-heading">Contact Us</h3>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon"><FaEnvelope /></div>
                            <span>support@bankify.com</span>
                        </div>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon"><FaPhone /></div>
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon"><FaMapMarkerAlt /></div>
                            <span>123 Banking St, Finance City, FC 12345</span>
                        </div>
                    </div>

                    <div className="footer-about-col">
                        <h3 className="footer-heading">About Us</h3>
                        <p className="footer-about-text">
                            BANKIFY is a modern banking platform designed to make financial services simple and accessible. We provide secure account management, instant transfers, and convenient bill payments all in one place.
                        </p>
                        <RouterLink to="/signup" className="footer-cta-button">
                            Create Account Now
                        </RouterLink>
                    </div>

                    <div className="footer-why-col">
                        <h3 className="footer-heading">Why Choose Us?</h3>
                        <div className="footer-why-item">
                            <div className="footer-why-icon"><FaShieldAlt /></div>
                            <span>Secure (JWT + encryption)</span>
                        </div>
                        <div className="footer-why-item">
                            <div className="footer-why-icon"><FaLightbulb /></div>
                            <span>Simple (Clean UI)</span>
                        </div>
                        <div className="footer-why-item">
                            <div className="footer-why-icon"><FaUsers /></div>
                            <span>Reliable (Simulated for learning/demo use)</span>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer-content">
                    <p className="footer-text">© 2025 BANKIFY. All Rights Reserved.</p>
                    <div className="social-links">
                        <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="https://github.com/sravan7979" className="social-link" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                        <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;