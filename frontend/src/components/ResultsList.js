// frontend/src/components/ResultsList.js
import React, { useState } from 'react';

export default function ResultsList({ result }) {
  const [showAll, setShowAll] = useState(false);

  if (!result.length) return null;

  // Full list view
  if (showAll || result.length <= 10) {
    return (
      <div className="results-list">
        <h2>Your Ranked Roster</h2>
        <ol>
          {result.map(w => (
            <li key={w.name}>
              {w.name} <small>({w.company})</small>
            </li>
          ))}
        </ol>
        {result.length > 10 && (
          <button onClick={() => setShowAll(false)}>
            Show Top & Bottom 5
          </button>
        )}
      </div>
    );
  }

  // Top 5 + Bottom 5 view
  const top5    = result.slice(0, 5);
  const bottom5 = result.slice(-5);

  return (
    <div className="results-list">
      <h2>Your Ranked Roster</h2>

      <h3>Fave 5</h3>
      <ol>
        {top5.map(w => (
          <li key={w.name}>
            {w.name} <small>({w.company})</small>
          </li>
        ))}
      </ol>

      <h3>Hated 5</h3>
      {/* “start” keeps correct numbering */}
      <ol start={result.length - 4}>
        {bottom5.map(w => (
          <li key={w.name}>
            {w.name} <small>({w.company})</small>
          </li>
        ))}
      </ol>

      <button onClick={() => setShowAll(true)}>
        Show All {result.length}
      </button>
    </div>
  );
}
