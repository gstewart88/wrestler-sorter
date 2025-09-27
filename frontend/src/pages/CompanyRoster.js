// src/pages/CompanyRoster.js
import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useWrestlers from '../hooks/useWrestlers';
import './CompanyRoster.scss';

export default function CompanyRoster() {
  const { slug } = useParams();
  const { wrestlers } = useWrestlers();

  const slugToName = {
    raw: 'Raw',
    smackdown: 'Smackdown',
    aew: 'AEW',
    tna: 'TNA',
    nxt: 'NXT',
    stardom: 'Stardom',
    tjpw: 'TJPW',
    njpw: 'NJPW',
    marigold: 'Marigold',
  };
  const company = slugToName[slug] || slug;
  const roster = wrestlers.filter(w => w.company === company);

  // Deduplicate by imageURL (fallback to name)
  const uniqueMap = new Map();
  roster.forEach(w => {
    const key = (w.imageURL && w.imageURL.trim()) || w.name || JSON.stringify(w);
    if (!uniqueMap.has(key)) uniqueMap.set(key, w);
  });
  const uniqueList = Array.from(uniqueMap.values());

  // Responsive column logic
  const containerRef = useRef(null);
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const CELL_PX = 160; // adjust minimum visual hex width
    function updateCols() {
      const width = containerRef.current?.offsetWidth || window.innerWidth / 2;
      const newCols = Math.max(1, Math.floor((width - 20) / CELL_PX));
      setCols(newCols);
    }
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // rows/hex-grid math
  const rows = Math.max(1, Math.ceil(uniqueList.length / Math.max(1, cols)));
  const n_cols_min = Math.max(1, cols);
  const n_cols_max = n_cols_min + 1;
  const n_cols_sum = n_cols_min + n_cols_max;
  const n = Math.ceil(0.5 * rows) * n_cols_min + Math.floor(0.5 * rows) * n_cols_max;

  const gridVars = {
    '--n-rows': rows,
    '--n-cols': 2 * n_cols_max
  };

  // selection state
  const [selected, setSelected] = useState(uniqueList[0] || null);
  useEffect(() => {
    setSelected(uniqueList[0] || null);
  }, [slug, wrestlers]); // reset when company changes or roster updates

  if (!uniqueList.length) {
    return (
      <div className="company-roster">
        <Link to="/" className="back-button">← Back Home</Link>
        <h1>{company} Roster</h1>
        <p>No wrestlers found for {company}.</p>
      </div>
    );
  }

  return (
    <div className="company-roster">
      <div className="company-header">
        <Link to="/" className="back-button">← Back Home</Link>
        <h1>{company} Roster</h1>
      </div>

      <div className="roster-layout">
        <div
          ref={containerRef}
          className="hex-grid"
          style={gridVars}
          aria-label={`${company} roster grid`}
        >
          <style>{`
            .hex-cell:nth-of-type(${n_cols_sum}n + 1) {
              grid-column-start: 2;
            }
          `}</style>

          {Array.from({ length: n }).map((_, i) => {
            const wrestler = uniqueList[i];
            if (!wrestler) {
              return <div className="hex-cell empty" key={i} aria-hidden="true" />;
            }

            const handleKeyDown = e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelected(wrestler);
              }
            };

            const isSelected = selected && (selected.name === wrestler.name || selected.imageURL === wrestler.imageURL);

            return (
              <div
                key={i}
                className={`hex-cell${isSelected ? ' selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(wrestler)}
                onKeyDown={handleKeyDown}
                aria-pressed={isSelected}
                title={wrestler.name}
              >
                <img
                  src={wrestler.imageURL}
                  alt={wrestler.name}
                  onError={e => { e.currentTarget.src = 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'; }}
                />
              </div>
            );
          })}
        </div>

        <aside className="detail-panel" aria-live="polite">
          {selected ? (
            <>
              <div className="detail-image-wrap">
                <img
                  className="detail-image"
                  src={selected.imageURL}
                  alt={selected.name}
                  onError={e => { e.currentTarget.src = 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'; }}
                />
              </div>
              <h2 className="detail-name">{selected.name}</h2>
              <div className="detail-bio">
                {selected.bio ? selected.bio : <em>No bio available.</em>}
              </div>
            </>
          ) : (
            <div className="detail-empty">Select a wrestler to see details.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
