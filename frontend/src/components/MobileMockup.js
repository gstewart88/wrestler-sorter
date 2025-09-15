// src/components/MobileMockup.js

import React, { forwardRef } from 'react';

const MobileMockup = forwardRef(({ top, fave5, hated5 }, ref) => (
  <div
    ref={ref}
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
    {/* Centered top wrestler */}
    <img
      src={top.imageURL}
      crossOrigin="anonymous"
      alt={top.name}
      onError={e => (e.currentTarget.src = 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png')}
      style={{
        display:   'block',
        margin:    '0 auto 12px',
        height:    '50%',
        width:     'auto',
        maxWidth:  '100%',
        objectFit: 'contain',
      }}
    />

    {/* Fave 5 / Hated 5 columns */}
    <div style={{ display: 'flex', height: 'calc(50% - 32px)' }}>
      <ul style={{ flex:1, margin:0, paddingLeft:'1rem', listStyle:'none' }}>
        <li style={{ fontWeight:'bold', marginBottom:'0.5rem' }}>Fave 5</li>
        {fave5.map((w,i) => (
          <li key={w.name} style={{ marginBottom:'0.25rem' }}>
            {i+1}. {w.name}
          </li>
        ))}
      </ul>
      <ul style={{ flex:1, margin:0, paddingLeft:'1rem', listStyle:'none' }}>
        <li style={{ fontWeight:'bold', marginBottom:'0.5rem' }}>Hated 5</li>
        {hated5.map((w,i) => (
          <li key={w.name} style={{ marginBottom:'0.25rem' }}>
            {i+1}. {w.name}
          </li>
        ))}
      </ul>
    </div>

    {/* Footer URL */}
    <div
      style={{
        position:  'absolute',
        bottom:    '12px',
        width:     '100%',
        textAlign: 'center',
        fontSize:  '12px',
        wordBreak: 'break-all',
      }}
    >
      {window.location.origin + window.location.pathname}
    </div>
  </div>
));

export default MobileMockup;
