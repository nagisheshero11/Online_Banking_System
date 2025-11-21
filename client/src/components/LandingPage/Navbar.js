import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './styles/Navbar.css';

const Navbar = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <RouterLink to="/" className="navbar-logo" onClick={scrollToTop}>
                        BANKIFY
                    </RouterLink>

                    <ul className="navbar-nav">
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