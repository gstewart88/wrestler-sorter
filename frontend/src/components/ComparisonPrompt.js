// frontend/src/components/ComparisonPrompt.js
import React from 'react';
import './ComparisonPrompt.css';

export default function ComparisonPrompt({ a, b, onChoose }) {
  return (
    <div className="comparison-overlay">
      <div className="comparison-box">
        <h3>Who do you prefer?</h3>
        <div className="options">
          <div className="option" onClick={() => onChoose(a)}>
            <img
              src={a.imageURL || '/images/placeholder.png'}
              alt={a.name}
              className="compare-img"
            />
            <div className="name">{a.name}</div>
          </div>
          <div className="option" onClick={() => onChoose(b)}>
            <img
              src={b.imageURL || '/images/placeholder.png'}
              alt={b.name}
              className="compare-img"
            />
            <div className="name">{b.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
