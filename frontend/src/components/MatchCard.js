// src/components/MatchCard.js
import React, { useEffect, useState } from 'react';
import './MatchCard.scss';

export default function MatchCard({ match }) {
  const watchedKey = `match:watched:${match.id}`;
  const spoilerKey = `match:spoiler:${match.id}`;

  const [watched, setWatched] = useState(() => localStorage.getItem(watchedKey) === '1');
  const [spoilerRevealed, setSpoilerRevealed] = useState(() => localStorage.getItem(spoilerKey) === '1');

  useEffect(() => {
    try {
      localStorage.setItem(watchedKey, watched ? '1' : '0');
    } catch (e) {
      // ignore storage errors in private mode
    }
  }, [watched, watchedKey]);

  useEffect(() => {
    try {
      localStorage.setItem(spoilerKey, spoilerRevealed ? '1' : '0');
    } catch (e) {
      // ignore storage errors in private mode
    }
  }, [spoilerRevealed, spoilerKey]);

  return (
    <article className="match-card">
      <div className="thumb">
        <img
          src={match.thumbnail}
          alt={`${match.title} thumbnail`}
          loading="lazy"
          decoding="async"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://catch-news.fr/images/2025/08/24/miu-watanabe-s-adjuge-la-tokyo-princess-cup-2025.jpg';
          }}
        />
      </div>

      <div className="meta">
        <h3>{match.title}</h3>
        <div className="sub">{match.promotion} • {match.card} • {match.date}</div>
        <p className="short">{match.short}</p>

        <div className="controls">
          <button onClick={() => setWatched(true)} disabled={watched}>Mark as watched</button>
          <button
            onClick={() => setSpoilerRevealed(true)}
            disabled={spoilerRevealed}
            aria-expanded={spoilerRevealed}
          >
            Reveal Spoiler
          </button>
        </div>

        <section className="background">
          <h4>Background</h4>
          <p>{match.background}</p>
        </section>

        <section className={`spoiler ${spoilerRevealed ? 'revealed' : 'hidden'}`} aria-hidden={!spoilerRevealed}>
          {!spoilerRevealed ? <div className="spoiler-warning">Spoiler hidden</div> : <p>{match.spoiler}</p>}
        </section>
      </div>
    </article>
  );
}
