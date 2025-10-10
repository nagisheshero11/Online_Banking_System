import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import './styles/CTABanner.css';

const CTABanner = () => {
    return (
        <section className="cta-banner">
            <div className="cta-container">
                <h2 className="cta-title">Ready to experience modern banking?</h2>
                <p className="cta-subtitle">
                    Join thousands of users who trust BANKIFY for their financial needs.
                </p>
                <RouterLink to="/signup" className="cta-button">
                    Create Account Now
                </RouterLink>
            </div>
        </section>
    );
};

export default CTABanner;