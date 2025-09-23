import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ScrollLink to="home" className="navbar-logo" smooth={true} duration={500}>
                    🏦 BANKIFY
                </ScrollLink>

                <ul className="navbar-nav">
                    <li>
                        <ScrollLink to="home" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                            Home
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="features" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                            Features
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="how-it-works" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                            How It Works
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="about" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                            About
                        </ScrollLink>
                    </li>
                    <li>
                        <Link to="/dashboard" className="nav-cta">
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
    );
};

export default Navbar;