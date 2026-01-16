// src/components/MatchCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MatchCard.scss';
import { IMAGES_CDN } from '../config';

export default function MatchCard({ match }) {
  const src = `${IMAGES_CDN}/${(match.imageURL || '').replace(/^\/+/, '')}`;

  return (
    <article className="mp-match-card match-card--compact" aria-labelledby={`match-title-${match.id}`}>
      <div className="mp-thumb">
        <img
          src={src}
          alt={`${match.title} thumbnail`}
          loading="lazy"
          decoding="async"
          width="320"
          height="180"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://catch-news.fr/images/2025/08/24/miu-watanabe-s-adjuge-la-tokyo-princess-cup-2025.jpg';
          }}
        />
      </div>

      <div className="mp-meta">
        <h3 id={`match-title-${match.id}`}>{match.title}</h3>
        <div className="mp-sub" aria-hidden="false">
          <span className="promotion">{match.promotion}</span>
          <span className="card">{match.card}</span>
          <time className="date" dateTime={match.date}>{match.date}</time>
        </div>

        {/* <p className="mp-short">{match.short}</p> */}

        <div className="mp-cta">
          <Link to={`/matches/${match.id}`} className="mp-btn mp-btn-primary read-more" aria-label={`Read more about ${match.title}`}>
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
