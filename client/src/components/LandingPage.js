import React from 'react';
import { Link } from 'react-scroll';
import { FaBars } from 'react-icons/fa';
import heroImage from '../assets/landing_home_img.png';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* ===== NAVBAR ===== */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="home" className="navbar-logo" smooth={true} duration={500}>
                        🏦 BANKIFY
                    </Link>

                    <ul className="navbar-nav">
                        <li>
                            <Link to="home" className="nav-link" smooth={true} duration={500}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="features" className="nav-link" smooth={true} duration={500}>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link to="how-it-works" className="nav-link" smooth={true} duration={500}>
                                How It Works
                            </Link>
                        </li>
                        <li>
                            <Link to="about" className="nav-link" smooth={true} duration={500}>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="contact" className="nav-cta" smooth={true} duration={500}>
                                Login / Register
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile menu toggle */}
                    <button className="mobile-menu-toggle">
                        <FaBars />
                    </button>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section id="home" className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Banking Made Simple,<br />
                            Secure & Smart
                        </h1>
                        <p className="hero-subtitle">
                            Manage accounts, transfer funds, pay bills, and request loans — all in one secure platform.
                        </p>
                        <div className="hero-buttons">
                            <Link to="contact" className="hero-btn-primary" smooth={true} duration={500}>
                                Get Started
                            </Link>
                            <Link to="features" className="hero-btn-secondary" smooth={true} duration={500}>
                                Learn More
                            </Link>
                        </div>
                    </div>

                    <div className="hero-image">
                        <img
                            src={heroImage}
                            alt="Banking Platform"
                            className="hero-img"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section will be added in Step 3 */}

            {/* How It Works Section will be added in Step 4 */}

            {/* About Section will be added in Step 4 */}

            {/* CTA Banner will be added in Step 5 */}

            {/* Footer will be added in Step 5 */}

            {/* Temporary spacing to test scroll navigation */}
            <div style={{ height: '200vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>🎉 Step 2 Complete!</h2>
                    <p>✅ Sticky navbar with smooth scroll navigation</p>
                    <p>✅ Beautiful hero section with CTA buttons</p>
                    <p>✅ Responsive design for mobile devices</p>
                    <p>✅ Gradient background and floating animation</p>
                    <br />
                    <p><strong>Try scrolling up to see the sticky navbar in action!</strong></p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;