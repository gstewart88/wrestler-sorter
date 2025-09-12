// src/components/ResultsList.js

import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import './ResultsList.css';

export default function ResultsList({ result, showAll, onToggle }) {
  // unconditionally call hooks
  const containerRef = useRef(null);
  const customRef    = useRef(null);

  // helper to download a Blob as a file
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

  // capture the on‐screen list as a PNG
  const exportAsImage = useCallback(async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, {
      useCORS:      true,
      allowTaint:   false,
      backgroundColor: '#fff',
      scale:        2,
    });
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'fave-hated-5.png');
    });
  }, [downloadBlob]);

  // capture a custom “mobile screen” layout as a PNG
  const exportCustomMobile = useCallback(async () => {
    if (!customRef.current) return;
    const canvas = await html2canvas(customRef.current, {
      useCORS:      true,
      allowTaint:   false,
      backgroundColor: null,
      scale:        2,
    });
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, 'mobile-fave-hated.png');
    });
  }, [downloadBlob]);

  if (!result || result.length === 0) return null;

  // prepare data slices
  const top    = result[0];
  const fave5  = result.slice(0, 5);
  const hated5 = result.slice(-5).reverse();

  // utility for rendering the standard list view
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

  // the two export buttons
  const exportControls = (
    <div className="d-flex justify-content-end mb-3">
      <button
        className="btn btn-outline-success btn-sm"
        onClick={exportCustomMobile}
      >
        Export Results
      </button>
    </div>
  );

  // render standard list or top/bottom 5
  const listView = showAll || result.length <= 10
    ? (
      <div ref={containerRef} className="results-container">
        {renderList(result)}
        {result.length > 10 && (
          <button className="btn btn-link" onClick={onToggle}>
            Show Top 5 & Bottom 5
          </button>
        )}
      </div>
    )
    : (
      <div ref={containerRef} className="results-container">
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
      {exportControls}
      {listView}

      {/*
        OFF-SCREEN: custom mobile mockup for export
        Positioned far off-screen so it doesn’t disrupt layout
      */}
      <div
        ref={customRef}
        style={{
          position:       'absolute',
          top:            -9999,
          left:           -9999,
          width:          '360px',
          height:         '640px',
          backgroundColor:'#0f0',
          color:          '#000',
          padding:        '16px',
          boxSizing:      'border-box',
          fontFamily:     'sans-serif',
          overflow:       'hidden',
        }}
      >
        {/* Top 50%: image of #1 wrestler */}
        <img
          src={top.imageURL}
          crossOrigin="anonymous"
          alt={top.name}
          onError={e => { e.currentTarget.src = '/images/placeholder.png'; }}
          style={{
            display:     'block',         // make it a block
            margin:      '0 auto 12px',   // horizontally center + 12px bottom gap
            height:      '50%',           // half the container’s height
            width:       'auto',          // natural aspect ratio
            maxWidth:    '100%',          // don’t overflow
            objectFit:   'contain'
          }}
        />

        {/* Bottom 50% minus footer: two columns */}
        <div style={{
          display: 'flex',
          height:  'calc(50% - 32px)'
        }}>
          <ul style={{
            flex: 1,
            margin: 0,
            paddingLeft: '1rem',
            listStyle: 'none'
          }}>
            <li style={{
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Fave 5
            </li>
            {fave5.map((w, i) => (
              <li key={w.name} style={{ marginBottom: '0.25rem' }}>
                {i + 1}. {w.name}
              </li>
            ))}
          </ul>
          <ul style={{
            flex: 1,
            margin: 0,
            paddingLeft: '1rem',
            listStyle: 'none'
          }}>
            <li style={{
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Hated 5
            </li>
            {hated5.map((w, i) => (
              <li key={w.name} style={{ marginBottom: '0.25rem' }}>
                {i + 1}. {w.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: current page URL */}
        <div style={{
          position:   'absolute',
          bottom:     '12px',
          width:      '100%',
          textAlign:  'center',
          fontSize:   '12px',
          wordBreak: 'break-all'
        }}>
          {window.location.origin + window.location.pathname}
        </div>
      </div>
    </>
  );
}
