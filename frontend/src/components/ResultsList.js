// src/components/ResultsList.js

import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import './ResultsList.css';

export default function ResultsList({ result, showAll, onToggle }) {
  // 1. Hooks must always be called unconditionally at the top
  const containerRef = useRef(null);

  const downloadBlob = useCallback((blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download= filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportAsImage = useCallback(async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, {
     useCORS:      true,          // ← enable cross-origin fetches
     allowTaint:   false,         // ← disallow tainted canvases
     backgroundColor: '#fff',
     scale:        2,
    });

    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'fave-hated-5.png');
    });
    }, [downloadBlob]);

  // 2. Now it’s safe to early-return without skipping any hooks
  if (!result || result.length === 0) {
    return null;
  }

  // 3. Helper to render the lists
  const renderList = (list, start = 1) => (
    <ol start={start} className="results-list">
      {list.map((w, i) => (
        <li key={w.name} className="results-item">
          <img
            src={w.imageURL}
            crossOrigin="anonymous"
            alt={w.name}
            className="result-thumb"
            onError={e => { e.currentTarget.src = '/images/placeholder.png'; }}
          />
          <div className="result-info">
            <div className="result-name">{i + start}. {w.name}</div>
            <div className="result-company">({w.company})</div>
          </div>
        </li>
      ))}
    </ol>
  );

  const top5    = result.slice(0, 5);
  const bottom5 = result.slice(-5);

  // Export button group (always visible)
  const exportControls = (
    <div className="d-flex justify-content-end mb-3">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={exportAsImage}
      >
        Export as Image
      </button>
    </div>
  );

  // 4. Render either full list or “Fave/Hated 5”
  if (showAll || result.length <= 10) {
    return (
      <>
        {exportControls}
        <div ref={containerRef} className="results-container">
          <h2>Your Full Ranked Roster</h2>
          {renderList(result)}
          {result.length > 10 && (
            <button className="btn btn-link" onClick={onToggle}>
              Show Top 5 & Bottom 5
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {exportControls}
      <div ref={containerRef} className="results-container">
        <h2>Your Ranked Roster</h2>

        <h3>Fave 5</h3>
        {renderList(top5)}

        <h3>Hated 5</h3>
        {renderList(bottom5, result.length - 4)}

        <button className="btn btn-link" onClick={onToggle}>
          Show All {result.length}
        </button>
      </div>
    </>
  );
}
