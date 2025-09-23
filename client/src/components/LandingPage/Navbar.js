import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaBars } from 'react-icons/fa';
import './styles/Navbar.css';
import AuthModal from './LoginandSignup'; // Using standard import without .js extension

const Navbar = () => {
    // State to manage the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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
                            {/* This is now a button to open the modal */}
                            <button onClick={handleOpenModal} className="nav-cta">
                                Login / Register
                            </button>
                        </li>
                    </ul>

                    {/* Mobile menu toggle */}
                    <button className="mobile-menu-toggle">
                        <FaBars />
                    </button>
                </div>
            </nav>

            {/* Render the modal component */}
            <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default Navbar;

