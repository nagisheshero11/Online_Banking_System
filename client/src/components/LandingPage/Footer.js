import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaShieldAlt, FaLightbulb, FaUsers, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-links">
                        <Link to="#" className="footer-link">Help</Link>
                        <Link to="#" className="footer-link">Contact</Link>
                        <Link to="#" className="footer-link">Fees</Link>
                        <Link to="#" className="footer-link">Security</Link>
                        <Link to="#" className="footer-link">Apps</Link>
                        <Link to="#" className="footer-link">Shop</Link>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-text">© 1999-2025 Bankify. All rights reserved.</p>
                        <div className="footer-legal">
                            <Link to="#" className="legal-link">Privacy</Link>
                            <Link to="#" className="legal-link">Cookies</Link>
                            <Link to="#" className="legal-link">Legal</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;