// src/pages/MatchDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { IMAGES_CDN } from '../config';
import './MatchDetail.scss';

function VideoEmbed({ video, title = 'Match video' }) { 
  if (!video) return null; 
  
  const asString = String(video).trim(); 
  
  // If the JSON contains a raw iframe HTML string, render it directly. 
  if (asString.startsWith('<iframe')) { 
    return ( 
    <div className="video-wrapper" aria-label={title} dangerouslySetInnerHTML={{ __html: asString }} /> 
  ); 
} 

// Otherwise treat the value as a URL and attempt to build a safe embed src. 
try { 
  const url = new URL(asString); 
  const host = url.hostname.replace(/^www\./, '').toLowerCase(); 
  
  // YouTube handling (youtube.com/watch?v= or youtu.be/) 
  if (host.includes('youtube.com') || host === 'youtu.be') { 
    // Try to extract a video id 
    let id = null; 
    if (host === 'youtu.be') { 
      id = url.pathname.slice(1); 
    } else { 
      id = url.searchParams.get('v') || null; 
      if (!id) { 
        // handle /embed/ID or /v/ID 
        const m = url.pathname.match(/\/(?:embed|v)\/([A-Za-z0-9_-]{6,})/); 
        if (m) id = m[1]; 
      } 
    } 
    if (id) { 
      const src = `https://www.youtube.com/embed/${id}?rel=0`; 
      return ( 
      <div className="video-wrapper" aria-label={title}> 
      <iframe 
        title={title} 
        src={src} 
        // frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen 
        /> 
        </div> 
        ); 
      } 
    } 
    
    // Dailymotion handling (dailymotion.com/video/ID or dai.ly/ID) 
    if (host.includes('dailymotion.com') || host === 'dai.ly') { 
      let id = null; 
      if (host === 'dai.ly') { 
        id = url.pathname.slice(1); 
      } else { 
        const m = url.pathname.match(/\/video\/([A-Za-z0-9]+)/); 
        if (m) id = m[1]; 
      } 
      if (id) { 
        const src = `https://www.dailymotion.com/embed/video/${id}`; 
        return ( 
        <div className="video-wrapper" aria-label={title}> 
        <iframe 
        title={title} 
        src={src} 
        // frameBorder="0" 
        allow="autoplay; fullscreen" 
        allowFullScreen 
        /> 
        </div> 
        ); 
      } 
    } 
    // Generic iframe-friendly provider fallback: embed the URL in an iframe 
    return ( 
    <div className="video-wrapper" aria-label={title}> 
    <iframe 
    title={title} 
    src={asString} 
    // frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowFullScreen 
    /> 
    </div> 
    ); 
  } catch (e) { 
    // If URL parsing fails, don't render anything 
    return null; 
  } 
}

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spoilerVisible, setSpoilerVisible] = useState(false);

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

  const renderText = (text) => { 
    if (!text && text !== '') return null; 
    return String(text) 
      .split('\n\n') 
      .map((para, i) => ( 
        <p key={i} style={{ whiteSpace: 'pre-wrap', marginTop: i === 0 ? 0 : '0.75rem' }}> 
          {para} 
        </p> 
      )); 
  };

  return (
    <Container className="py-4">
      {/* Header styled to match CompanyRoster's header layout:
          a back link and an h1 on the same row (CSS class 'company-header' expected) */}
      <div className="company-header" role="banner"> 
        <button
          type="button"
          className="back-button" 
          onClick={() => { 
            // prefer history back, fallback to a safe href
            if (window.history.length > 1) navigate(-1);
             else window.location.href = fallbackHref;
              }}
               aria-label="Back" 
              > 
                ← Back 
              </button>
                
              <h1 className="company-title">{match.title}</h1> 
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
            {/* {match.short && (
              <>
                <h3>Summary</h3>
                <p>{match.short}</p>
              </>
            )} */}

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

            {/* Video block (renders YouTube / Dailymotion / iframe / URL) */} 
            {match.video && ( 
              <> 
                <h3>Video</h3> 
                <VideoEmbed video={match.video} title={`${match.title} video`} /> 
              </> 
            )}

            {/* Result / Spoiler: hidden by default, revealed by user */}
            {match.spoiler && (
              <section className="result-section">
                {!spoilerVisible && (
                <button
                  type="button"
                  className="reveal-spoiler"
                  aria-expanded={String(spoilerVisible)}
                  aria-controls="spoiler-content"
                  onClick={() => setSpoilerVisible(true)}
                >
                  I've watched it
                  </button>
                  )}

                  {spoilerVisible && (
                    <div
                    id="spoiler-content" 
                    className="spoiler-content" 
                    role="region" 
                    aria-hidden={String(!spoilerVisible)} 
                    >
                    <h3>Aftermath</h3> 
                    <p>{match.spoiler}</p> 
                    </div> 
                  )}
                    </section>
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
                'cagematch',
                'video'
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
