// frontend/src/components/WrestlerGrid.js

import React from 'react';
import './WrestlerGrid.css';

export default function WrestlerGrid({ wrestlers }) {
  return (
    <div className="wrestler-grid">
      {wrestlers.map(w => {
        const imageURL = w.imageURL

        return (
          <div key={w.id || w.name} className="wrestler-cell">
            <img
              src={imageURL}
              alt={w.name}
              className="wrestler-image"
              loading="lazy"
              onError={e => {
                e.currentTarget.src = 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png';
              }}
            />
          </div>
        );
      })}
    </div>
  );
}