// src/components/ResultsList.js

import React, { useRef } from 'react';
import MobileMockup    from './MobileMockup';
import useHtml2CanvasExport from '../hooks/useHtml2CanvasExport';
import './ResultsList.css';

export default function ResultsList({ result, showAll, onToggle }) {
  const listRef   = useRef(null);
  const mobileRef = useRef(null);
  const { exportRef } = useHtml2CanvasExport();

  if (!result || !result.length) return null;

  const top    = result[0];
  const fave5  = result.slice(0, 5);
  const hated5 = result.slice(-5).reverse();

  // Helper to render your OL-based list
  const renderList = (list, start = 1) => (
    <ol start={start} className="results-list">
      {list.map((w, i) => (
        <li key={w.name} className="results-item">
          <img
            src={w.imageURL}
            crossOrigin="anonymous"
            alt={w.name}
            className="result-thumb"
            onError={e => (e.currentTarget.src = '/images/placeholder.png')}
          />
          <div className="result-info">
            <div className="result-name">{i + start}. {w.name}</div>
            <div className="result-company">({w.company})</div>
          </div>
        </li>
      ))}
    </ol>
  );

  // Decide which list block to show
  const listView = showAll || result.length <= 10
    ? (
      <div ref={listRef} className="results-container">
        {renderList(result)}
        {result.length > 10 && (
          <button className="btn btn-link" onClick={onToggle}>
            Show Top 5 & Bottom 5
          </button>
        )}
      </div>
    )
    : (
      <div ref={listRef} className="results-container">
        <h3>Fave 5</h3>
        {renderList(fave5)}
        <h3>Hated 5</h3>
        {renderList(hated5, result.length - 4)}
        <button className="btn btn-link" onClick={onToggle}>
          Show All {result.length}
        </button>
      </div>
    );

  return (
    <>
      {listView}

      {/* off-screen mobile mockup for html2canvas */}
      <MobileMockup
        ref={mobileRef}
        top={top}
        fave5={fave5}
        hated5={hated5}
      />

      {/* Export button pinned bottom-right */}
      <div className="position-fixed bottom-0 end-0 m-3">
        <button
          className="btn btn-outline-success"
          onClick={() =>
            exportRef(
              mobileRef,
              { backgroundColor: null },
              'mobile-fave-hated.png'
            )
          }
        >
          Export Mobile Layout
        </button>
      </div>
    </>
  );
}
