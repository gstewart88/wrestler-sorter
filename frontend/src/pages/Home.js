// src/pages/Home.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Button, Offcanvas } from 'react-bootstrap';
import CompanyFilter from '../components/CompanyFilter';
import ComparisonPrompt from '../components/ComparisonPrompt';
import WrestlerGrid from '../components/WrestlerGrid';
import ResultsList from '../components/ResultsList';
import fordJohnsonSort from '../utils/fordJohnsonSort';
import './Home.css';

export default function Home() {
  // Data & filter state
  const [wrestlers, setWrestlers]       = useState([]);
  const [companies, setCompanies]       = useState([]);
  const [selectedCompanies, setSelected]= useState(['WWE']);
  const [showAll, setShowAll]           = useState(false);

  // UI state
  const [filterOpen, setFilterOpen]     = useState(false);
  const [sorting, setSorting]           = useState(false);
  const [currentPair, setCurrentPair]   = useState(null);
  const [awaiting, setAwaiting]         = useState(null);
  const [result, setResult]             = useState(null);

  // Load data
  useEffect(() => {
    fetch('http://localhost:3001/api/wrestlers')
      .then(r => r.json())
      .then(data => {
        setWrestlers(data);
        const unique = [...new Set(data.map(w => w.company))].filter(Boolean);
        setCompanies(unique);
      });
  }, []);

  // Toggle a company filter
  function toggleCompany(c) {
    setSelected(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  }

  // Base compare that shows the prompt
  function compareUser(a, b) {
    return new Promise(resolve => {
      setCurrentPair({ a, b });
      setAwaiting(() => resolve);
    });
  }

  // Cache wrapper to avoid re-asking the same pair
  const cacheRef = useRef(new Map());
  const compareWithCache = useCallback(
    async (a, b) => {
      // build a key that's order-agnostic
      const idA = a.id ?? a.name;
      const idB = b.id ?? b.name;
      const key = idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;

      // if we've seen this pair, return stored winner
      if (cacheRef.current.has(key)) {
        return cacheRef.current.get(key) === idA ? a : b;
      }

      // otherwise prompt user once
      const winner = await compareUser(a, b);
      const winId = winner.id ?? winner.name;
      cacheRef.current.set(key, winId);
      return winner;
    },
    [compareUser]
  );

  // Kick off sorting
  async function handleStart() {
    setSorting(true);
    cacheRef.current.clear();

    const filtered = wrestlers.filter(w =>
      selectedCompanies.includes(w.company)
    );

    // Optional dry-run to count comparisons (not displayed here)
    await fordJohnsonSort(filtered, async () => true);

    // Real sort with cache-backed comparisons
    const sorted = await fordJohnsonSort(filtered, compareWithCache);
    setResult(sorted);
    setSorting(false);
  }

  // When user picks A or B
  function handleChoice(chosen) {
    if (!awaiting) return;
    const resolve = awaiting;
    setAwaiting(null);
    setCurrentPair(null);
    resolve(chosen);
  }

  const filtered = wrestlers.filter(w =>
    selectedCompanies.includes(w.company)
  );

  return (
    <Row className="g-0 home-container">
      {/* Sidebar on md+ */}
      <Col
        xs={12}
        md={3}
        lg={2}
        className="bg-light border-end d-none d-md-block"
      >
        <CompanyFilter
          companies={companies}
          selected={selectedCompanies}
          onToggle={toggleCompany}
        />
      </Col>

      {/* Mobile filter Offcanvas */}
      <Offcanvas
        show={filterOpen}
        onHide={() => setFilterOpen(false)}
        className="d-md-none"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter by Company</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CompanyFilter
            companies={companies}
            selected={selectedCompanies}
            onToggle={toggleCompany}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main content */}
      <Col xs={12} md={9} lg={10} className="p-3 content">
        {/* Mobile hamburger */}
        <Button
          variant="outline-secondary"
          className="d-md-none mb-3"
          onClick={() => setFilterOpen(true)}
        >
          ☰ Filter
        </Button>

        <h1 className="text-center">Wrestler Sorter</h1>

        <Button
          variant="primary"
          className="d-block mx-auto my-3"
          onClick={handleStart}
          disabled={!selectedCompanies.length || sorting}
        >
          {sorting ? 'Sorting…' : 'Start Sorting'}
        </Button>

        {/* Comparison prompt */}
        {sorting && currentPair && (
          <ComparisonPrompt
            a={currentPair.a}
            b={currentPair.b}
            onChoose={handleChoice}
          />
        )}

        {/* Results */}
        {result && !sorting && (
          <ResultsList
            result={result}
            showAll={showAll}
            onToggle={() => setShowAll(x => !x)}
          />
        )}

        {/* Preview grid */}
        {!sorting && !result && (
          <>
            <h3 className="mt-4">Preview ({filtered.length})</h3>
            <WrestlerGrid wrestlers={filtered} />
          </>
        )}
      </Col>
    </Row>
  );
}
