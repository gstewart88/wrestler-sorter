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
import Header from '../components/Header';

export default function Home() {
  // Data & filter state
  const [selectedCompanies, setSelected]     = useState(['Raw']);
  const [divisionFilter, setDivisionFilter]  = useState('All');
  const [showAll, setShowAll]                = useState(false);
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
  const toggleCompany = c => {
    setSelected(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  // Preview filtering
  const filtered = wrestlers.filter(w => {
    const byCompany  = selectedCompanies.includes(w.company);
    const byDivision = divisionFilter === 'All' || w.division === divisionFilter;
    const byIgnore   = !ignoredSet.has(w.id ?? w.name);
    return byCompany && byDivision && byIgnore;
  });

  // Final results minus ignored
  const filteredResult = result
    ? result.filter(w => !ignoredSet.has(w.id ?? w.name))
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
          disabled={!selectedCompanies.length}
          onClick={() => {
            // build the list you want to sort:
            const toSort = shuffleArray(
              wrestlers.filter(w => {
                const byCompany  = selectedCompanies.includes(w.company);
                const byDivision = divisionFilter === 'All'
                  || w.division === divisionFilter;
                return byCompany && byDivision;
              })
            );
            handleStart(toSort);
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
