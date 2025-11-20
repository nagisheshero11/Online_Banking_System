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
                    <Link to="home" className="navbar-logo" smooth={true} duration={500} offset={-80}>
                        BANKIFY
                    </Link>

                    <ul className="navbar-nav">
                        <li>
                            <Link to="home" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                Personal
                            </Link>
                        </li>
                        <li>
                            <Link to="features" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                Business
                            </Link>
                        </li>
                        <li>
                            <Link to="how-it-works" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                Developer
                            </Link>
                        </li>
                        <li>
                            <Link to="about" className="nav-link" smooth={true} duration={500} spy={true} activeClass="active" offset={-80}>
                                Help
                            </Link>
                        </li>
                        <li className="nav-btn-group">
                            <RouterLink to="/login" className="btn btn-outline btn-sm">Log In</RouterLink>
                            <RouterLink to="/signup" className="btn btn-primary btn-sm">Sign Up</RouterLink>
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