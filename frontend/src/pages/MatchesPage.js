// src/pages/MatchesPage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import MatchCard from '../components/MatchCard';
import './MatchesPage.scss'; // optional: create for page-specific styles
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10;
const base = process.env.PUBLIC_URL || '';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${base}/data/matches.json`, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load matches.json (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        // Ensure array and stable ordering (you can sort here if desired)
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load matches');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Pagination calculations
  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = matches.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    // If matches change and current page is out of range, clamp it
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  if (loading) {
    return (
      <Container className="py-4">
        <p>Loading matches…</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <p className="text-danger">Error: {error}</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <header className="matches-header mb-3 d-flex align-items-center justify-content-between">
        <h1 className="h4 m-0">Matches</h1>
        <div className="meta small text-muted">
          Showing <strong>{visible.length}</strong> of <strong>{total}</strong>
        </div>
      </header>

      <Row xs={1} md={2} lg={2} className="g-3">
        {visible.map((m) => (
          <Col key={m.id}>
            <MatchCard match={m} />
          </Col>
        ))}
      </Row>

      <nav aria-label="Matches pagination" className="mt-4 d-flex justify-content-between align-items-center">
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="me-2"
          >
            First
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="me-2"
          >
            Prev
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="me-2"
          >
            Next
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>

        <div className="d-flex align-items-center">
          <span className="me-3 small text-muted">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <ButtonGroup size="sm" aria-label="Jump to page">
            {/*
              Render a compact set of page buttons. For large page counts you may want
              to render a subset (e.g., current ±2). This renders up to 7 buttons.
            */}
            {(() => {
              const buttons = [];
              const maxButtons = 7;
              let startPage = Math.max(1, currentPage - 3);
              let endPage = Math.min(totalPages, startPage + maxButtons - 1);
              if (endPage - startPage + 1 < maxButtons) {
                startPage = Math.max(1, endPage - maxButtons + 1);
              }
              for (let p = startPage; p <= endPage; p++) {
                buttons.push(
                  <Button
                    key={p}
                    variant={p === currentPage ? 'primary' : 'outline-secondary'}
                    onClick={() => setPage(p)}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </Button>
                );
              }
              return buttons;
            })()}
          </ButtonGroup>
        </div>
      </nav>

      <footer className="mt-4 small text-muted">
        <Link to="/matches">View all</Link>
      </footer>
    </Container>
  );
}
