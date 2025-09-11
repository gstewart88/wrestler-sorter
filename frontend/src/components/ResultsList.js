// src/components/ResultsList.js
import React from 'react';
import './ResultsList.css';

export default function ResultsList({ result, showAll, onToggle }) {
  if (!result || result.length === 0) return null;

  // Helper to render a list of wrestlers with images
  const renderList = (list, start = 1) => (
    <ol start={start} className="results-list">
      {list.map(w => (
        <li key={w.name} className="results-item">
          <img
            src={w.imageURL}
            alt={w.name}
            className="result-thumb"
            onError={e => { e.currentTarget.src = '/images/placeholder.png'; }}
          />
          <div className="result-info">
            <div className="result-name">{w.name}</div>
            <div className="result-company">({w.company})</div>
          </div>
        </li>
      ))}
    </ol>
  );

  // Full-list view
  if (showAll || result.length <= 10) {
    return (
      <div className="results-container">
        <h2>Your Full Ranked Roster</h2>
        {renderList(result)}
        {result.length > 10 && (
          <button className="btn btn-link" onClick={onToggle}>
            Show Top 5 & Bottom 5
          </button>
        )}
      </div>
    );
  }

  // Top & bottom 5 view
  const top5 = result.slice(0, 5);
  const bottom5 = result.slice(-5);

  return (
    <div className="results-container">
      <h2>Your Ranked Roster</h2>

      <h3>Fave 5</h3>
      {renderList(top5)}

      <h3>Hated 5</h3>
      {renderList(bottom5, result.length - 4)}

      <button className="btn btn-link" onClick={onToggle}>
        Show All {result.length}
      </button>
    </div>
  );
}
