// src/pages/CompanyRoster.js
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useWrestlers from '../hooks/useWrestlers';
import './CompanyRoster.scss';

const PALETTE = [
  '#FFD166','#EF476F','#06D6A0','#118AB2',
  '#073B4C','#F4A261','#9D4EDD','#FF7A5A'
];

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  if (cleaned.length === 3) {
    const r = (bigint >> 8) & 0xf;
    const g = (bigint >> 4) & 0xf;
    const b = bigint & 0xf;
    return { r: r * 17, g: g * 17, b: b * 17 };
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export default function CompanyRoster() {
  const { slug } = useParams();
  const { wrestlers } = useWrestlers();

  const slugToName = {
    aew: 'AEW',
    marigold: 'Marigold',
    njpw: 'NJPW',
    nxt: 'NXT',
    raw: 'Raw',
    smackdown: 'Smackdown',
    stardom: 'Stardom',
    tjpw: 'TJPW',
    tna: 'TNA'
    // cmll: 'CMLL',
  };
  const company = slugToName[slug] || slug;
  const roster = wrestlers.filter(w => w.company === company);

  // Deduplicate by imageURL (fallback to name)
  const uniqueMap = new Map();
  roster.forEach(w => {
    const key = (w.imageURL && w.imageURL.trim()) || w.name || JSON.stringify(w);
    if (!uniqueMap.has(key)) uniqueMap.set(key, w);
  });
 const uniqueList = useMemo(() => {
  const map = new Map();
  wrestlers
    .filter(w => w.company === company)
    .forEach(w => {
      const key = (w.imageURL && w.imageURL.trim()) || w.name || JSON.stringify(w);
      if (!map.has(key)) map.set(key, w);
    });
  return Array.from(map.values());
}, [wrestlers, company]);

  // Responsive column logic
  const containerRef = useRef(null);
  const [cols, setCols] = useState(4);

  const [cellSize, setCellSize] = useState({ l: 160, ri: Math.floor((0.5 * Math.sqrt(3) * 160)) });

  useEffect(() => {
    const CELL_PX = 160; // adjust minimum visual hex width
    function updateColsAndSize() {
      const width = containerRef.current?.offsetWidth || Math.max(320, window.innerWidth / 2);
      const newCols = Math.max(1, Math.floor((width - 20) / CELL_PX));
      setCols(newCols);
      const nColsMin = Math.max(1, newCols);
      const nColsMax = nColsMin + 1;
      const totalGridCols = 2 * nColsMax;

      const usableWidth = Math.max(40, width - 8);
      const ri = Math.floor(usableWidth / totalGridCols);
      const l = Math.max(36, Math.floor((2 * ri) / Math.sqrt(3)));

      setCellSize({ l, ri });
    }
    updateColsAndSize();
    window.addEventListener('resize', updateColsAndSize);
    return () => window.removeEventListener('resize', updateColsAndSize);
  }, []);

  const n_cols_min = Math.max(1, cols);
  const n_cols_max = n_cols_min + 1;
  const rowsArray = []; // array of rows, each row is an array of items or null slots
  let idx = 0;
  let rowIndex = 0;
  while (idx < uniqueList.length) {
    const capacity = (rowIndex % 2 === 0) ? n_cols_min : n_cols_max;
    const rowItems = uniqueList.slice(idx, idx + capacity);
    const filledRow = Array.from({ length: capacity }).map((_, i) => rowItems[i] ?? null);
    rowsArray.push(filledRow);
    idx += capacity;
    rowIndex += 1;
  }

  const rowsUsed = rowsArray.length;
  const n_cols_sum = n_cols_min + n_cols_max;

  const gridVars = {
    '--n-rows': rowsUsed,
    '--n-cols': 2 * n_cols_max,
    '--l': `${cellSize.l}px`,
    '--ri': `${cellSize.ri}px`
  };

  // selection state
  const [selected, setSelected] = useState(uniqueList[0] || null);
  useEffect(() => {
  setSelected(uniqueList[0] || null);
  }, [uniqueList]);

  // computed promotions URL on the same origin
  const promotionsHref = `${window.location.origin}/wrestler-sorter#/promotions`;

  // Mobile detection + mobile UI state
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 520);
  useEffect(() => {
    function onResize() {
      const nowMobile = window.innerWidth <= 520;
      setIsMobile(nowMobile);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!uniqueList.length) {
    return (
      <div className="company-roster">
        <div className="company-header">
          <a className="back-button" href={promotionsHref}>← Back</a>
          <h1>Roster | {company}</h1>
        </div>
        <p>No wrestlers found for {company}.</p>
      </div>
    );
  }

  // Mobile rendering: compact phone-like shell (does not affect desktop)
  if (isMobile) {
  return (
    <div className="company-roster mobile-simple">
      {/* Main image & bio */}
      <div className="simple-main">
        <div className="simple-header">
          <a
            className="back-button"
            href={promotionsHref}
            aria-label="Back"
          >
            ←
          </a>
          <div className="simple-name">
            {selected?.name}
          </div>
        </div>
        <img
          src={selected?.imageURL}
          alt={selected?.name || 'Selected wrestler'}
          onError={e => {
            e.currentTarget.src =
              'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png';
          }}
        />
        <div className="simple-bio">
          {selected?.bio ? selected.bio : <em>No bio available.</em>}
        </div>
      </div>

      {/* Fixed horizontal roster at bottom */}
      <div className="simple-roster" role="navigation" aria-label="Select wrestler">
        {uniqueList.map((w, i) => {
          const isSel =
            selected &&
            (selected.name === w.name || selected.imageURL === w.imageURL);
          const paletteColor = PALETTE[i % PALETTE.length];
          const { r, g, b } = hexToRgb(paletteColor);
          const styleVars = {
            '--hex-r': r,
            '--hex-g': g,
            '--hex-b': b,
          };

          return (
            <button
              key={i}
              className={`simple-tile${isSel ? ' selected' : ''}`}
              style={styleVars}
              onClick={() => setSelected(w)}
              aria-pressed={isSel}
              title={w.name}
            >
              <img
                src={w.imageURL}
                alt={w.name}
                onError={e => {
                  e.currentTarget.src =
                    'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png';
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

  return (
    <div className="company-roster">
      <div className="company-header">
        <a className="back-button" href={promotionsHref}>← Back</a>
        <h1>Roster | {company}</h1>
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

          {rowsArray.flatMap((row, rIdx) =>
            row.map((wrestler, cIdx) => {
              const key = `r${rIdx}-c${cIdx}`;
              if (!wrestler) {
                return <div className="hex-cell empty" key={key} aria-hidden="true" />;
              }

              const handleKeyDown = e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(wrestler);
                }
              };

              const isSelected = selected && (selected.name === wrestler.name || selected.imageURL === wrestler.imageURL);

              // pick palette color and expose as CSS vars
              const paletteIndex = (rIdx * Math.max(1, n_cols_max) + cIdx) % PALETTE.length;
              const paletteColor = PALETTE[paletteIndex];
              const { r, g, b } = hexToRgb(paletteColor);
              const styleVars = {
                '--hex-bg': paletteColor,
                '--hex-r': r,
                '--hex-g': g,
                '--hex-b': b
              };

              return (
                <div
                  key={key}
                  className={`hex-cell${isSelected ? ' selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(wrestler)}
                  onKeyDown={handleKeyDown}
                  aria-pressed={isSelected}
                  title={wrestler.name}
                  style={styleVars}
                >
                  <img
                    src={wrestler.imageURL}
                    alt={wrestler.name}
                    onError={e => { e.currentTarget.src = 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'; }}
                  />
                </div>
              );
            })
          )}
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
                <div className="detail-name">{selected.name}</div>
              </div>
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
