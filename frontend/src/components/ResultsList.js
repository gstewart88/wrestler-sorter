// src/components/ResultsList.js

import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import './ResultsList.css';

export default function ResultsList({ result, showAll, onToggle }) {
  if (!result || result.length === 0) return null;

  const containerRef = useRef(null);

  // download a Blob as file
  const downloadBlob = useCallback((blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  // capture the results-container as a PNG
  const exportAsImage = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: '#fff',
      scale: 2
    });
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'fave-hated-5.png');
    });
  };

  // helper for rendering an ordered list
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

  const top5 = result.slice(0, 5);
  const bottom5 = result.slice(-5);

  // Export button always sits above, but is outside the capture wrapper
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

  // Full-list view
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

  // Top & bottom 5 view
  return (
    <>
      {exportControls}
      <div ref={containerRef} className="exportable">
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
