// src/pages/Home.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Button, Offcanvas, Form } from 'react-bootstrap';
import CompanyFilter    from '../components/CompanyFilter';
import ComparisonPrompt from '../components/ComparisonPrompt';
import WrestlerGrid     from '../components/WrestlerGrid';
import ResultsList      from '../components/ResultsList';
import fordJohnsonSort  from '../utils/fordJohnsonSort';
import './Home.css';
import bookerTLogo from '../assets/bookert.png';

export default function Home() {
  // Booker T speech-bubble state
  const quotes = [
    'Can you dig it, sucker!',
    'Tell me you did not just say that',
    'Shucky ducky quack quack',
    'You lookin real jacked, baby',
    '5 time'
  ];
  const [currentQuote, setCurrentQuote] = useState('');
  const [showQuote, setShowQuote]       = useState(false);

  const handleLogoClick = () => {
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(pick);
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 5000);
  };

  // Data & filter state
  const [wrestlers, setWrestlers]            = useState([]);
  const [companies, setCompanies]            = useState([]);
  const [selectedCompanies, setSelected]     = useState(['WWE']);
  const [divisionFilter, setDivisionFilter]  = useState('All');
  const [showAll, setShowAll]                = useState(false);

  // UI state
  const [filterOpen, setFilterOpen]     = useState(false);
  const [sorting, setSorting]           = useState(false);
  const [currentPair, setCurrentPair]   = useState(null);
  const [awaiting, setAwaiting]         = useState(null);
  const [result, setResult]             = useState(null);

  // Track ignored wrestlers by ID/name
  const ignoreSet = useRef(new Set());

  // Load static JSON once
// inside src/pages/Home.js, replace your useEffect with this:

useEffect(() => {
  // base filenames (no .json, no leading slash)
  const parts = ['aew', 'marigold', 'njpw', 'stardom', 'tjpw', 'wwe'];

  Promise.all(
    parts.map(key =>
      fetch(
        // PUBLIC_URL ensures the correct base path in prod
        `${process.env.PUBLIC_URL}/${key}.json`
      )
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load ${key}.json`);
          return res.json();
        })
    )
  )
    .then(arrays => {
      // flatten: [ [...], [...], … ] → one big array
      const allWrestlers = arrays.flat();
      setWrestlers(allWrestlers);

      // recalc your unique company list
      const unique = [
        ...new Set(allWrestlers.map(w => w.company))
      ].filter(Boolean);
      setCompanies(unique);
    })
    .catch(err => {
      console.error('Error loading wrestler data:', err);
    });
}, []);


  // Toggle a company filter
  const toggleCompany = c => {
    setSelected(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  // Show the comparison prompt
  function compareUser(a, b) {
    return new Promise(resolve => {
      setCurrentPair({ a, b });
      setAwaiting(() => resolve);
    });
  }

  // Wrap with caching + ignore logic
  const cacheRef = useRef(new Map());
  const compareWithCache = useCallback(
    async (a, b) => {
      const idA = a.id ?? a.name;
      const idB = b.id ?? b.name;

      if (ignoreSet.current.has(idA)) return b;
      if (ignoreSet.current.has(idB)) return a;

      const key = idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;
      if (cacheRef.current.has(key)) {
        return cacheRef.current.get(key) === idA ? a : b;
      }

      const winner = await compareUser(a, b);
      const winId   = winner.id ?? winner.name;
      cacheRef.current.set(key, winId);
      return winner;
    },
    []
  );

  // Handle “Ignore” click
  function handleIgnore(ignored) {
    if (!awaiting || !currentPair) return;
    const ignoreId = ignored.id ?? ignored.name;
    ignoreSet.current.add(ignoreId);
    const other = ignored === currentPair.a ? currentPair.b : currentPair.a;
    const resolve = awaiting;
    setAwaiting(null);
    setCurrentPair(null);
    resolve(other);
  }

  // Handle normal choice
  function handleChoice(chosen) {
    if (!awaiting) return;
    const resolve = awaiting;
    setAwaiting(null);
    setCurrentPair(null);
    resolve(chosen);
  }

  // Start the sorting run
  async function handleStart() {
    setSorting(true);
    ignoreSet.current.clear();
    cacheRef.current.clear();

    const toSort = wrestlers.filter(w => {
      const byCompany  = selectedCompanies.includes(w.company);
      const byDivision = divisionFilter === 'All' || w.division === divisionFilter;
      const byIgnore   = !ignoreSet.current.has(w.id ?? w.name);
      return byCompany && byDivision && byIgnore;
    });

    // dry-run to count comparisons
    await fordJohnsonSort(toSort, async () => true);

    // real sort with user input
    const sorted = await fordJohnsonSort(toSort, compareWithCache);
    setResult(sorted);
    setSorting(false);
  }

  // Preview filtering
  const filtered = wrestlers.filter(w => {
    const byCompany  = selectedCompanies.includes(w.company);
    const byDivision = divisionFilter === 'All' || w.division === divisionFilter;
    const byIgnore   = !ignoreSet.current.has(w.id ?? w.name);
    return byCompany && byDivision && byIgnore;
  });

  // Final results minus ignored
  const filteredResult = result
    ? result.filter(w => !ignoreSet.current.has(w.id ?? w.name))
    : [];

  return (
    <>
      <header className="page-header d-flex justify-content-between align-items-center px-3 py-2">
        <h2 className="mb-0">Fave Five</h2>

        <div className="logo-container" style={{ cursor: 'pointer' }}>
          <img
            src={bookerTLogo}
            alt="Booker T"
            className="header-logo"
            onClick={handleLogoClick}
          />
          {showQuote && (
            <div className="speech-bubble">
              {currentQuote}
            </div>
          )}
        </div>
      </header>

      <Row className="g-0 home-container">
        {/* Desktop sidebar */}
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
          <hr />
          <div className="division-filter">
            <div><strong>Division</strong></div>
            <Form.Check
              type="radio"
              id="div-all"
              label="All"
              name="division"
              checked={divisionFilter === 'All'}
              onChange={() => setDivisionFilter('All')}
            />
            <Form.Check
              type="radio"
              id="div-men"
              label="Men’s"
              name="division"
              checked={divisionFilter === "Men's"}
              onChange={() => setDivisionFilter("Men's")}
            />
            <Form.Check
              type="radio"
              id="div-women"
              label="Women’s"
              name="division"
              checked={divisionFilter === "Women's"}
              onChange={() => setDivisionFilter("Women's")}
            />
          </div>
        </Col>

        {/* Mobile Offcanvas */}
        <Offcanvas
          show={filterOpen}
          onHide={() => setFilterOpen(false)}
          className="d-md-none"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div><strong>Company</strong></div>
            <CompanyFilter
              companies={companies}
              selected={selectedCompanies}
              onToggle={toggleCompany}
            />
            <hr />
            <div className="division-filter">
              <div><strong>Division</strong></div>
              <Form.Check
                type="radio"
                id="div-all-mobile"
                label="All"
                name="division-mobile"
                checked={divisionFilter === 'All'}
                onChange={() => setDivisionFilter('All')}
              />
              <Form.Check
                type="radio"
                id="div-men-mobile"
                label="Men’s"
                name="division-mobile"
                checked={divisionFilter === "Men's"}
                onChange={() => setDivisionFilter("Men's")}
              />
              <Form.Check
                type="radio"
                id="div-women-mobile"
                label="Women’s"
                name="division-mobile"
                checked={divisionFilter === "Women's"}
                onChange={() => setDivisionFilter("Women's")}
              />
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main content */}
        <Col xs={12} md={9} lg={10} className="p-3 content">
          <Button
            variant="outline-secondary"
            className="d-md-none mb-3"
            onClick={() => setFilterOpen(true)}
          >
            ☰ Filter
          </Button>

          <ul className="instructions list-unstyled text-center mb-4">
            <li>Use filters for company and division</li>
            <li>Choose ignore to remove wrestler from consideration</li>
            <li>Answer A v B to determine your favourite wrestlers!</li>
          </ul>

        {!result && !sorting && (
          <Button
            variant="primary"
            className="d-block mx-auto my-3"
            onClick={handleStart}
            disabled={!selectedCompanies.length}
          >
          Start Sorting
          </Button>
        )}

          {sorting && currentPair && (
            <ComparisonPrompt
              a={currentPair.a}
              b={currentPair.b}
              onChoose={handleChoice}
              onIgnore={handleIgnore}
            />
          )}

          {result && !sorting && (
            <ResultsList
              result={filteredResult}
              showAll={showAll}
              onToggle={() => setShowAll(x => !x)}
            />
          )}

          {!sorting && !result && (
            <>
              <h3 className="mt-4">Preview ({filtered.length})</h3>
              <WrestlerGrid wrestlers={filtered} />
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
