import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import './styles/HeroSection.css';

const HeroSection = () => {
    return (
        <section id="home" className="hero-section">
            <div className="hero-globe">
                <div className="globe-continent c1"></div>
                <div className="globe-continent c2"></div>
                <div className="globe-continent c3"></div>
            </div>
            <div className="hero-container">
                {/* CSS Credit Card */}
                <div className="hero-card-container">
                    <div className="hero-card">
                        <div className="card-content">
                            <div className="card-logo">BANKIFY</div>
                            <div className="card-chip"></div>
                            <div className="card-number">•••• •••• •••• 1644</div>
                            <div className="card-details">
                                <div className="card-name">Nagi Seishiro</div>
                                <div className="card-brand">VISA</div>
                            </div>
                        </div>
                        <div className="card-shine"></div>
                    </div>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Money on Bankify<br />can buy anything.
                    </h1>
                    <p className="hero-subtitle">
                        With Bankify , you can spend your balance Without Any Conflicts
                    </p>
                    <div className="hero-buttons">
                        <RouterLink to="/signup" className="btn btn-primary hero-cta">
                            signup
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;