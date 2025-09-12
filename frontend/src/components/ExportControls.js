// src/components/ExportControls.js

import React from 'react';

export default function ExportControls({
  onExportList,
  onExportMobile
}) {
  return (
    <div className="d-flex justify-content-end mb-3">
      <button
        className="btn btn-outline-primary btn-sm me-2"
        onClick={onExportList}
      >
        Export as Image
      </button>
      <button
        className="btn btn-outline-success btn-sm"
        onClick={onExportMobile}
      >
        Export Mobile Layout
      </button>
    </div>
  );
}
