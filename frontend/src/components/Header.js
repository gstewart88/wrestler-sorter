// src/components/Header.js

import React, { useState } from 'react';
import siteLogoLight from '../assets/logo2.png';
import siteLogoDark  from '../assets/logo.png';
import bookerTLogo from '../assets/bookert.png';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const quotes = [
    'Can you dig it, sucker!',
    'Tell me you did not just say that',
    'Shucky ducky quack quack',
    'You lookin real jacked, baby',
    '5 time'
  ];
  const [currentQuote, setCurrentQuote] = useState('');
  const [showQuote, setShowQuote]       = useState(false);

  const handleLogoClick = () => {
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(pick);
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 5000);
  };

   const handleHomeClick = (e) => {
    const h = window.location.hash || '';
    if (h === '#/' || h === '#' || h === '') {
      // prevent react-router Link navigation and force a full page reload
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
  <header className="page-header d-flex justify-content-between align-items-center px-3 py-2">

    <div className="header-left d-flex align-items-center">
      <picture>
        <source srcSet={siteLogoLight} media="(prefers-color-scheme: dark)" />
        <img src={siteLogoDark} alt="Fave Five" className="site-logo" />
      </picture>

      <nav className="navMenu" role="navigation" aria-label="Primary">
        <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
        <Link to="/promotions" className="nav-link">Promotions</Link>
        <Link to="/matches" className="nav-link">Matches</Link>
        <span className="dot" aria-hidden="true" />
      </nav>
    </div>

    <div className="logo-container" onClick={handleLogoClick} role="button" tabIndex={0} /* keyboard support */>
      <img src={bookerTLogo} alt="Booker T" className="header-logo" />
      {showQuote && <div className="speech-bubble">{currentQuote}</div>}
    </div>
  </header>
);
}
