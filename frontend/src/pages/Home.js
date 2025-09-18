// src/pages/Home.js

import useWrestlers from '../hooks/useWrestlers';
import React, { useState, useRef, useCallback } from 'react';
import { Row, Col, Button, Offcanvas, Form, ProgressBar } from 'react-bootstrap';
import CompanyFilter    from '../components/CompanyFilter';
import ComparisonPrompt from '../components/ComparisonPrompt';
import WrestlerGrid     from '../components/WrestlerGrid';
import ResultsList      from '../components/ResultsList';
import fordJohnsonSort  from '../utils/fordJohnsonSort';
import { countComparisons } from '../utils/countComparisons';
import shuffleArray     from '../utils/shuffleArray';
import './Home.css';
import Header from '../components/Header';

export default function Home() {

  // progress‐bar state
  const [totalComparisons, setTotalComparisons]       = useState(0);
  const [completedComparisons, setCompletedComparisons] = useState(0);

  // Data & filter state
  const [selectedCompanies, setSelected]     = useState(['Raw']);
  const [divisionFilter, setDivisionFilter]  = useState('All');
  const [showAll, setShowAll]                = useState(false);
  const { wrestlers, companies } = useWrestlers();

  // UI state
  const [filterOpen, setFilterOpen]     = useState(false);
  const [sorting, setSorting]           = useState(false);
  const [currentPair, setCurrentPair]   = useState(null);
  const [awaiting, setAwaiting]         = useState(null);
  const [result, setResult]             = useState(null);

  const ignoreSet = useRef(new Set());

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

    const randomized = shuffleArray(toSort);

    // 1) estimate total comparisons in O(1)
    const estimate = countComparisons(toSort.length);
    setTotalComparisons(estimate);
    setCompletedComparisons(0);

    // 2) wrap compareWithCache so each decision ticks the progress
    const realCompare = async (a, b) => {
    const winner = await compareWithCache(a, b);
    setCompletedComparisons(c => c + 1);
    return winner;
    };

    const sorted = await fordJohnsonSort(randomized, realCompare);
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
      <Header />
      <Row className="g-0 home-container">
        {/* Desktop sidebar */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="sidebar border-end d-none d-md-block"
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

        {/* Instruction panel */}
        <div className="instructions-panel mb-4">
          <ul className="instructions list-unstyled text-center">
            <li>Use filters for company and division.</li>
            <li>Choose ignore to remove wrestler from consideration.</li>
            <li>Answer A v B to determine your favourite wrestlers!</li>
          </ul>
        </div>

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
          <>
          <div className="comparison-backdrop" />
          <ComparisonPrompt
            a={currentPair.a}
            b={currentPair.b}
            onChoose={handleChoice}
            onIgnore={handleIgnore}
            totalComparisons={totalComparisons}
            completedComparisons={completedComparisons}
          />
          </>
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
