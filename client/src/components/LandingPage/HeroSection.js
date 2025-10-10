import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import heroImage from '../../assets/landing_home_img.png';
import './styles/HeroSection.css';

const HeroSection = () => {
    return (
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
                        <RouterLink to="/signup" className="hero-btn-primary">
                            Get Started
                        </RouterLink>
                        <Link to="features" className="hero-btn-secondary" smooth={true} duration={500} offset={-80}>
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
    );
};

export default HeroSection;