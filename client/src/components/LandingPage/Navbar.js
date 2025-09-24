import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './styles/Navbar.css';

const Navbar = () => {

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="home" className="navbar-logo" smooth={true} duration={500}>
                        🏦 BANKIFY
                    </Link>

                    <ul className="navbar-nav">
                        <li>
                            <Link to="home" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="features" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link to="how-it-works" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                How It Works
                            </Link>
                        </li>
                        <li>
                            <Link to="about" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                About
                            </Link>
                        </li>
                        <li>
                            <RouterLink to="/login" className="nav-cta">Login / Register</RouterLink>
                        </li>
                    </ul>

                    {/* Mobile menu toggle */}
                    <button className="mobile-menu-toggle">
                        <FaBars />
                    </button>
                </div>
            </nav>

        </>
    );
};

export default Navbar;