// src/components/ResultsList.js

import React, { useRef } from 'react';
import ExportControls from './ExportControls';
import MobileMockup   from './MobileMockup';
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

  return (
    <>
      <ExportControls
        onExportList={() => exportRef(listRef, {}, 'fave-hated-5.png')}
        onExportMobile={() =>
          exportRef(mobileRef, { backgroundColor: null }, 'mobile-fave-hated.png')
        }
      />

      <div ref={listRef} className="results-container">
        {/* your existing list rendering logic */}
      </div>

      <MobileMockup
        ref={mobileRef}
        top={top}
        fave5={fave5}
        hated5={hated5}
      />
    </>
  );
}
