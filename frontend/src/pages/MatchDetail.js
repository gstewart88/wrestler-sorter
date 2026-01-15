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

  // If you want a same-origin fallback link (like CompanyRoster used), compute it here.
  const fallbackHref = `${window.location.origin}/matches`;

  return (
    <Container className="py-4">
      {/* Header styled to match CompanyRoster's header layout:
          a back link and an h1 on the same row (CSS class 'company-header' expected) */}
      <div className="company-header" role="banner" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <a
          className="back-button"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // prefer history back, fallback to a safe href
            if (window.history.length > 1) navigate(-1);
            else window.location.href = fallbackHref;
          }}
          aria-label="Back"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          ← Back
        </a>

        <h1 style={{ margin: 0, fontSize: '1.25rem', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {match.title}
        </h1>
      </div>

      <article className="match-detail" style={{ marginTop: 0 }}>
        <div
          className="detail-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '1rem',
            alignItems: 'start'
          }}
        >
          <div className="detail-image" style={{ borderRadius: 8, overflow: 'hidden', background: '#f6f7fb', display: 'flex', flexDirection: 'column' }}>
            <img
              src={src}
              alt={match.title}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png';
              }}
            />

            <div
              className="info-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                padding: '0.75rem',
                background: '#fff',
                borderTop: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Where</div>
                <div>{infoValue(match.where)}</div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Location</div>
                <div>{infoValue(match.location)}</div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Won</div>
                <div>{infoValue(match.won)}</div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Cage Match</div>
                <div>{infoValue(match.cagematch)}</div>
              </div>
            </div>
          </div>

          <div className="detail-body" style={{ minWidth: 0 }}>
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

            {/* Render any other fields generically (exclude known keys) */}
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
                'background',
                'spoiler',
                'order',
                'where',
                'location',
                'won',
                'cagematch'
              ].includes(k)) return null;

              return (
                <div key={k} style={{ marginTop: '0.75rem' }}>
                  <h4 style={{ margin: 0, marginBottom: '0.35rem' }}>{k}</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f9fb', padding: '0.6rem', borderRadius: 6 }}>{String(match[k])}</pre>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </Container>
  );
}
