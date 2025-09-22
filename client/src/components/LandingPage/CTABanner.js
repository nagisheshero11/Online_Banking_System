import React from 'react';
import { Link } from 'react-scroll';
import './styles/CTABanner.css';

const CTABanner = () => {
    return (
        <section className="cta-banner">
            <div className="cta-container">
                <h2 className="cta-title">Ready to experience modern banking?</h2>
                <p className="cta-subtitle">
                    Join thousands of users who trust BANKIFY for their financial needs.
                </p>
                <Link to="contact" className="cta-button" smooth={true} duration={500}>
                    Create Account Now
                </Link>
            </div>
        </section>
    );
};

export default CTABanner;