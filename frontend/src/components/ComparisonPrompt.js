// src/components/ComparisonPrompt.js

import React from 'react';
import './ComparisonPrompt.css';

export default function ComparisonPrompt({ a, b, onChoose, onIgnore }) {
  return (
    <div className="comparison-overlay">
      <div className="comparison-box">
        <h3>Who do you prefer?</h3>
        <div className="options">

          <div
            className="option"
            onClick={() => onChoose(a)}
          >
            <img
              src={a.imageURL || '/images/placeholder.png'}
              alt={a.name}
              className="compare-img"
            />
            <div className="name">{a.name}</div>
            <button
              className="ignore-btn"
              onClick={e => {
                e.stopPropagation();
                onIgnore(a);
              }}
            >
              Ignore
            </button>
          </div>

          <div
            className="option"
            onClick={() => onChoose(b)}
          >
            <img
              src={b.imageURL || '/images/placeholder.png'}
              alt={b.name}
              className="compare-img"
            />
            <div className="name">{b.name}</div>
            <button
              className="ignore-btn"
              onClick={e => {
                e.stopPropagation();
                onIgnore(b);
              }}
            >
              Ignore
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
