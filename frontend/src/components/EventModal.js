// src/components/EventModal.js
import React from 'react'
import './EventModal.scss'

export default function EventModal({ date, events, onClose }) {
  const title = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="event-modal-backdrop" onClick={onClose}>
      <div
        className="event-modal-content"
        onClick={e => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        <ul className="modal-events-list">
          {events.map((e, i) => (
            <li key={i}>
              <strong>{e.name}</strong>
              <div className="promo-tag">{e.promotion}</div>
              <div className="modal-event-city">{e.city}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
