// src/pages/Home.js

import useWrestlers from '../hooks/useWrestlers';
import React, { useState, useRef, useCallback } from 'react';
import { Row, Col, Button, Offcanvas, Form, ProgressBar } from 'react-bootstrap';
import CompanyFilter    from '../components/CompanyFilter';
import ComparisonPrompt from '../components/ComparisonPrompt';
import WrestlerGrid     from '../components/WrestlerGrid';
import ResultsList      from '../components/ResultsList';
import useSorter from '../hooks/useSorter';
import shuffleArray from '../utils/shuffleArray';
import './Home.css';

export default function Home() {

  const [startTime, setStartTime] = useState(null); // ms since epoch
  const [finalSummary, setFinalSummary] = useState(null); // { choices, elapsedMs }

  // Data & filter state
  const [selectedCompanies, setSelected]     = useState(['Raw']);
  const [divisionFilter, setDivisionFilter]  = useState('All');
  const [showAll, setShowAll]                = useState(false);
  const [removedPreview, setRemovedPreview]  = useState(new Set());
  const { wrestlers, companies } = useWrestlers();

    // Sorting flow from custom hook
  const {
    sorting,
    currentPair,
    totalComparisons,
    completedComparisons,
    result,
    handleStart,
    handleChoice,
    handleIgnore,
    handleExit,
    ignoredSet
    } = useSorter();

  // UI state
  const [filterOpen, setFilterOpen]     = useState(false);

  // Toggle a company filter
  const togglePreview = w => {
    const id = w.id ?? w.name;
    setRemovedPreview(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle a company filter.
  // When turning it back on, undo any preview‐removals for that company.
  const toggleCompany = c => {
    const isOn = selectedCompanies.includes(c);

    if (isOn) {
      // Switch off: simply remove from selectedCompanies
      setSelected(prev => prev.filter(x => x !== c));
    } else {
      // Switch on: restore all removed-preview items for company c
      setRemovedPreview(prevRemovals => {
        const next = new Set(prevRemovals);
        wrestlers
          .filter(w => w.company === c)
          .forEach(w => next.delete(w.id ?? w.name));
        return next;
      });
      setSelected(prev => [...prev, c]);
    }
  };

  // Base filtering (ignores only company/division/ignore)
  const filtered = wrestlers.filter(w => {
    const byCompany  = selectedCompanies.includes(w.company);
    const byDivision = divisionFilter === 'All' || w.division === divisionFilter;
    const byIgnore   = !ignoredSet.has(w.id ?? w.name);
    return byCompany && byDivision && byIgnore;
  });

  // Preview list excludes preview-removed
  const previewList = filtered.filter(w => !removedPreview.has(w.id ?? w.name));

  // Compute how many per-company remain vs. total
  const companyStats = companies.reduce((acc, company) => {
    const total   = filtered.filter(w => w.company === company).length;
    const shown   = previewList.filter(w => w.company === company).length;
    acc[company]  = { total, shown };
    return acc;
  }, {});

  // when result becomes available, compute elapsed and capture choices
  React.useEffect(() => {
    if (result && startTime) {
      const end = Date.now();
      setFinalSummary({
        choices: completedComparisons ?? 0,
        elapsedMs: Math.max(0, end - startTime)
      });
      // clear startTime so repeated views won't reuse it
      setStartTime(null);
    }
  }, [result, startTime, completedComparisons]);

  // Final results minus ignored
  const filteredResult = result
    ? result.filter(w => !ignoredSet.has(w.id ?? w.name))
    : [];
     return (
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
            stats={companyStats}
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
            stats={companyStats}
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
            <li>Use filters to create the list to choose from.</li>
            <li>Choose ignore to remove a wrestler from the list.</li>
            <li>Answer A v B to determine your Fave Five!</li>
            <li>Warning: A large list of wrestlers means a lot more comparisons</li>
          </ul>
        </div>

        {!result && !sorting && (
        <Button
          variant="primary"
          className="d-block mx-auto my-3"
          disabled={!selectedCompanies.length || previewList.length === 0}
          onClick={() => {
            setStartTime(Date.now());
            setFinalSummary(null);
            handleStart(shuffleArray(previewList));
          }}
        >
          Start
        </Button>
        )}

        {sorting && (
          <>
          <div className="comparison-backdrop" />
          <ComparisonPrompt
            a={currentPair?.a}
            b={currentPair?.b}
            onChoose={handleChoice}
            onIgnore={handleIgnore}
            onExit={handleExit}
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
              summary={finalSummary}
            />
          )}

          {!sorting && !result && (
            <>
              <h3 className="mt-4">
                Preview ({previewList.length} of {filtered.length})
              </h3>
              <WrestlerGrid
                wrestlers={previewList}
            removedSet={removedPreview}
            onToggleRemove={togglePreview}
          />
            </>
          )}
        </Col>
      </Row>
  );
}
