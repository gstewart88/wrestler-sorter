// src/pages/MatchDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { IMAGES_CDN } from '../config';
import './MatchDetail.scss';

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const base = process.env.PUBLIC_URL || '';
    fetch(`${base}/data/matches.json`, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load matches.json (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        const found = list.find((m) => String(m.id) === String(id));
        setMatch(found || null);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load match data');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Container className="py-4">
        <p>Loading match…</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <p className="text-danger">Error: {error}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container className="py-4">
        <h2>Match not found</h2>
        <p>The match you requested could not be located.</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </Container>
    );
  }

  const src = `${IMAGES_CDN}/${(match.imageURL || '').replace(/^\/+/, '')}`;

  const infoValue = (v) => (v === undefined || v === null || v === '' ? '—' : String(v));

  return (
    <Container className="py-4">
      <Button variant="link" onClick={() => navigate(-1)} className="mb-3 mp-back-link">← Back</Button>

      <article className="match-detail mp-match-detail">
        <header className="mp-header">
          <h1 className="mp-title">{match.title}</h1>
          <div className="mp-sub text-muted">
            <span>{match.promotion}</span>
            <span> • </span>
            <span>{match.card}</span>
            <span> • </span>
            <time dateTime={match.date}>{match.date}</time>
          </div>
        </header>

        <div className="mp-detail-grid">
          <div className="mp-detail-image" aria-hidden={false}>
            <img
              src={src}
              alt={match.title}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://catch-news.fr/images/2025/08/24/miu-watanabe-s-adjuge-la-tokyo-princess-cup-2025.jpg';
              }}
            />

            <div className="mp-info-grid" role="group" aria-label="Match information">
              <div className="mp-info-cell">
                <div className="mp-info-label">Where</div>
                <div className="mp-info-value">{infoValue(match.where)}</div>
              </div>

              <div className="mp-info-cell">
                <div className="mp-info-label">Location</div>
                <div className="mp-info-value">{infoValue(match.location)}</div>
              </div>

              <div className="mp-info-cell">
                <div className="mp-info-label">Won</div>
                <div className="mp-info-value">{infoValue(match.won)}</div>
              </div>

              <div className="mp-info-cell">
                <div className="mp-info-label">Cage Match</div>
                <div className="mp-info-value">{infoValue(match.cagematch)}</div>
              </div>
            </div>
          </div>

          <div className="mp-detail-body">
            {match.short && (
              <>
                <h3>Summary</h3>
                <p>{match.short}</p>
              </>
            )}

            {match.full && (
              <>
                <h3>Full Details</h3>
                <p>{match.full}</p>
              </>
            )}

            {match.competitors && (
              <>
                <h3>Competitors</h3>
                <ul>
                  {match.competitors.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </>
            )}

            {match.background && (
              <>
                <h3>Background</h3>
                <p>{match.background}</p>
              </>
            )}

            {match.spoiler && (
              <>
                <h3>Result / Spoiler</h3>
                <p>{match.spoiler}</p>
              </>
            )}

            {Object.keys(match).map((k) => {
              if ([
                'id',
                'title',
                'date',
                'promotion',
                'card',
                'imageURL',
                'short',
                'full',
                'competitors',
                'background',
                'spoiler',
                'order',
                'where',
                'location',
                'won',
                'cagematch'
              ].includes(k)) return null;

              return (
                <div className="mp-generic-field" key={k}>
                  <h4>{k}</h4>
                  <pre className="mp-generic-pre">{String(match[k])}</pre>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </Container>
  );
}