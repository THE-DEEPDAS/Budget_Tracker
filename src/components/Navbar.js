import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-header">
                    <a href="#" className="navbar-brand">Budget Tracker</a>
                </div>
                <div className="navbar-toggle" onClick={toggleDropdown}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
                <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                    <a className="nav-link" href="https://capify.vercel.app/">Home</a>
                    <a className="nav-link" href="https://group-finance-manager.vercel.app/login">SplitSmart</a>
                    <a className="nav-link" href="https://financial-calculators-seven.vercel.app/">Calculators</a>
                    <div className="dropdown">
                        <a href="#trackers" className="nav-link dropdown-toggle" onClick={toggleDropdown}>
                            Trackers
                        </a>
                        <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                            <a className="dropdown-item" href="https://balance-tracker-ashy.vercel.app/">Balance Tracker</a>
                            <a className="dropdown-item" href="https://budget-tracker-k8yo.vercel.app/">Budget Tracker</a>
                        </div>
                    </div>
                    <a className="nav-link" href="https://financial-health-quiz.vercel.app/">Financial Health Quiz</a>
                    <a className="nav-link" href="https://blogs-section-three.vercel.app/">Blogs</a>
                    <a className="nav-link" href="https://resources-section.vercel.app/">Resources</a>
                    <a className="nav-link" href="https://capify.vercel.app/#about">About Us</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
