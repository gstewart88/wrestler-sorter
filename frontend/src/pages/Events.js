// src/pages/Events.js
import React, { useState, useMemo } from 'react'
import Calendar from 'react-calendar'
import EventModal from '../components/EventModal'
import events from '../data/events.json'
import './Events.scss'

export default function Events() {
  // parse dates once
  const parsed = useMemo(
    () => events.map(e => ({ ...e, date: new Date(e.date) })),
    []
  )

  // derive unique promotion & city lists
  const promotions = useMemo(
    () => Array.from(new Set(parsed.map(e => e.promotion))),
    [parsed]
  )
  const cities = useMemo(
    () => Array.from(new Set(parsed.map(e => e.city))),
    [parsed]
  )

  // filter state
  const [selectedPromos, setSelectedPromos] = useState(promotions)
  const [selectedCity, setSelectedCity] = useState('All')

  // apply filters
  const filtered = useMemo(
    () =>
      parsed.filter(
        e =>
          selectedPromos.includes(e.promotion) &&
          (selectedCity === 'All' || e.city === selectedCity)
      ),
    [parsed, selectedPromos, selectedCity]
  )

  // modal
  const [selectedDate, setSelectedDate] = useState(null)
  const dayEvents = selectedDate
    ? filtered.filter(
        e => e.date.toDateString() === selectedDate.toDateString()
      )
    : []

  // toggle promo checkbox
  const togglePromo = promo => {
    setSelectedPromos(prev =>
      prev.includes(promo)
        ? prev.filter(p => p !== promo)
        : [...prev, promo]
    )
  }

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>

      {/* ——— Filter Bar ——— */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Promotion:</label>
          {promotions.map(promo => (
            <label key={promo}>
              <input
                type="checkbox"
                checked={selectedPromos.includes(promo)}
                onChange={() => togglePromo(promo)}
              />
              {promo}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <label htmlFor="city-select">City:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            <option value="All">All</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ——— Calendar ——— */}
      <Calendar
        onClickDay={date => {
          // only open if that day has filtered events
          if (
            filtered.some(e => e.date.toDateString() === date.toDateString())
          ) {
            setSelectedDate(date)
          }
        }}
        tileClassName={({ date, view }) => {
          if (view !== 'month') return null
          const match = filtered.find(
            e => e.date.toDateString() === date.toDateString()
          )
          return match ? `promo-${match.promotion.toLowerCase()}` : null
        }}
        tileContent={({ date }) => {
          const matches = filtered.filter(
            e => e.date.toDateString() === date.toDateString()
          )
          return matches.length ? (
            <ul className="tile-events">
              {matches.map((e, i) => (
                <li key={i}>{e.promotion}</li>
              ))}
            </ul>
          ) : null
        }}
      />

      {/* ——— Detail Modal ——— */}
      {selectedDate && (
        <EventModal
          date={selectedDate}
          events={dayEvents}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
