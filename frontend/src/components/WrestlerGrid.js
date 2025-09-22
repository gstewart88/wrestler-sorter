// src/components/WrestlerGrid.js
import React from 'react';
import './WrestlerGrid.css';

export default function WrestlerGrid({ wrestlers, removedSet = new Set(), onToggleRemove = () => {} }) {
  return (
    <div className="wrestler-grid">
      {wrestlers.map(w => {
        const id      = w.id ?? w.name;
        const removed = removedSet.has(id);
        const imageURL = w.imageURL;

        return (
          <div
            key={id}
            className={`wrestler-cell${removed ? ' removed' : ''}`}
          >
            <img
              src={imageURL}
              alt={w.name}
              className="wrestler-image"
              loading="lazy"
              onError={e => {
                e.currentTarget.src =
                  'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png';
              }}
            />

            <button
              className="remove-btn"
              onClick={e => {
                e.stopPropagation();
                onToggleRemove(w);
              }}
              aria-label={removed ? 'Restore wrestler' : 'Remove wrestler'}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
