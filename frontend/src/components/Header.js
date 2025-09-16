// src/components/Header.js

import React, { useState } from 'react';
import siteLogoLight from '../assets/logo2.png';
import siteLogoDark  from '../assets/logo.png';
import bookerTLogo from '../assets/bookert.png';
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

  return (
    <header className="page-header d-flex justify-content-between align-items-center px-3 py-2">
      {/* Your new site logo */}
        <picture>
            <source
                srcSet={siteLogoDark}
                media="(prefers-color-scheme: dark)"
            />
             <img
                src={siteLogoLight}
                alt="Fave Five"
                className="site-logo"
            />
        </picture>

      <div className="logo-container" onClick={handleLogoClick}>
        <img
          src={bookerTLogo}
          alt="Booker T"
          className="header-logo"
        />
        {showQuote && (
          <div className="speech-bubble">
            {currentQuote}
          </div>
        )}
      </div>
    </header>
  );
}
