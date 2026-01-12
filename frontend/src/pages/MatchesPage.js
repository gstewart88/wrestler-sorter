// src/pages/MatchesPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import './MatchesPage.scss';
import '../styles/article.scss';

const PAGE_SIZE = 10;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const navigate = useNavigate();
  const pageParam = parseInt(query.get('page') || '1', 10);
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const base = process.env.PUBLIC_URL || '';

  useEffect(() => {
    setLoading(true);
    fetch(base + '/data/matches.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load matches JSON');
        return r.json();
      })
      .then(arr => {
        // ensure stable ordering
        arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setMatches(arr);
      })
      .catch(err => {
        console.error('Failed to load matches JSON', err);
        setMatches([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return matches.slice(start, start + PAGE_SIZE);
  }, [matches, currentPage]);

  const goTo = page => {
    const p = Math.max(1, Math.min(totalPages, page));
    navigate(`?page=${p}`, { replace: true });
  };

  return (
    <main className="matches-page">
      <h1>101 Matches You Should Watch</h1>

      {loading ? (
        <p>Loading matches…</p>
      ) : (
        <>
          <div className="matches-grid">
            {pageItems.map(m => <MatchCard key={m.id} match={m} />)}
          </div>

          <nav className="pagination" aria-label="Matches pagination">
            <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </nav>
        </>
      )}
    </main>
  );
}
