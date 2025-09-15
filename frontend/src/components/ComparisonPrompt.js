// src/components/ComparisonPrompt.js

import React from 'react';
import './ComparisonPrompt.css';
import { ProgressBar } from 'react-bootstrap';

export default function ComparisonPrompt({
  a,
  b,
  onChoose,
  onIgnore,
  totalComparisons = 0,
  completedComparisons = 0
}) {
  const percent =
    totalComparisons > 0
      ? Math.round((completedComparisons / totalComparisons) * 100)
      : 0;
  return (
    <div className="comparison-overlay">
      <div className="comparison-box">

      <ProgressBar
        now={percent}
        label={`${percent}%`}
        className="mb-3"
      />

        <h3>Who do you prefer?</h3>
        <div className="options">

          <div
            className="option"
            onClick={() => onChoose(a)}
          >
            <img
              src={a.imageURL || 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'}
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
              src={b.imageURL || 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'}
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
