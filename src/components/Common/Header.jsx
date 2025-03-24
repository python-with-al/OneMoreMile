// Header.jsx
import React from 'react';
import './header.css'; // We'll create this CSS file next

const Header = () => {
return (
    <header className="header">
        <div className="logo">
            <img src="/src/assets/OneMoreMile logo cropped.svg" alt="OneMoreMile logo" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="logo-text" style={{ fontSize: '18px', fontStyle: 'italic' }}>Become a Better Runner</span>
                <span className="logo-text" style={{ fontSize: '12px' }}>OneMoreMile.com</span>
            </div>
        </div>
        <nav className="nav-menu">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/login">Login</a>
        </nav>
    </header>
);
};

export default Header;