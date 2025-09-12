// src/pages/Home.js

import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import {
  Row,
  Col,
  Button,
  Offcanvas
} from 'react-bootstrap';
import CompanyFilter    from '../components/CompanyFilter';
import ComparisonPrompt from '../components/ComparisonPrompt';
import WrestlerGrid     from '../components/WrestlerGrid';
import ResultsList      from '../components/ResultsList';
import fordJohnsonSort  from '../utils/fordJohnsonSort';
import './Home.css';
import bookerTLogo from '../assets/bookert.png';

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

  // Track ignored wrestlers by ID/name
  const ignoreSet = useRef(new Set());

  // Load static JSON
  useEffect(() => {
    fetch('wrestlers.json')
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

  // Show the comparison prompt
  function compareUser(a, b) {
    return new Promise(resolve => {
      setCurrentPair({ a, b });
      setAwaiting(() => resolve);
    });
  }

  // Cache + auto-skip ignored wrapper
  const cacheRef = useRef(new Map());
  const compareWithCache = useCallback(
    async (a, b) => {
      const idA = a.id ?? a.name;
      const idB = b.id ?? b.name;

      // auto-skip if one is ignored
      if (ignoreSet.current.has(idA)) return b;
      if (ignoreSet.current.has(idB)) return a;

      // order-agnostic key
      const key = idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;

      if (cacheRef.current.has(key)) {
        return cacheRef.current.get(key) === idA ? a : b;
      }

      // first-time ask user
      const winner = await compareUser(a, b);
      const winId   = winner.id ?? winner.name;
      cacheRef.current.set(key, winId);
      return winner;
    },
    []
  );

  // Handle “Ignore” click in the prompt
  function handleIgnore(ignored) {
    if (!awaiting || !currentPair) return;

    // mark ignored
    const ignoreId = ignored.id ?? ignored.name;
    ignoreSet.current.add(ignoreId);

    // resolve comparison with the other item
    const other =
      ignored === currentPair.a ? currentPair.b : currentPair.a;

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

  // Start the sort run
  async function handleStart() {
    setSorting(true);
    ignoreSet.current.clear();
    cacheRef.current.clear();

    // prepare list, filtering out ignored
    const toSort = wrestlers.filter(
      w =>
        selectedCompanies.includes(w.company) &&
        !ignoreSet.current.has(w.id ?? w.name)
    );

    // (optional) dry-run to count comparisons
    await fordJohnsonSort(toSort, async () => true);

    // real sort with cached+ignored logic
    const sorted = await fordJohnsonSort(toSort, compareWithCache);
    setResult(sorted);
    setSorting(false);
  }

  // Filter preview to skip ignored
  const filtered = wrestlers.filter(
    w =>
      selectedCompanies.includes(w.company) &&
      !ignoreSet.current.has(w.id ?? w.name)
  );

 // remove any ignored wrestlers from the final sorted array
  const filteredResult = result
    ? result.filter(w => !ignoreSet.current.has(w.id ?? w.name))
    : [];

  return (
       <>
     <header className="page-header d-flex justify-content-between align-items-center px-3 py-2">
       <h2 className="mb-0">Fave Five</h2>
       <img
        src={bookerTLogo}
        alt="Booker T"
        className="header-logo"
      />
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
      </Col>

      {/* Mobile Offcanvas */}
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
        {/* Mobile filter button */}
        <Button
          variant="outline-secondary"
          className="d-md-none mb-3"
          onClick={() => setFilterOpen(true)}
        >
          ☰ Filter
        </Button>

         <ul className="instructions list-unstyled text-center mb-4">
          <li>Select the companies you wish to use from the filter menu</li>
          <li>Answer A v B to determine your favourite wrestlers!</li>
          <li>Use ignore to remove wrestlers from the list</li>
        </ul>

        <Button
          variant="primary"
          className="d-block mx-auto my-3"
          onClick={handleStart}
          disabled={!selectedCompanies.length || sorting}
        >
          {sorting ? 'Sorting…' : 'Start Sorting'}
        </Button>

        {/* Comparison prompt with Ignore */}
        {sorting && currentPair && (
          <ComparisonPrompt
            a={currentPair.a}
            b={currentPair.b}
            onChoose={handleChoice}
            onIgnore={handleIgnore}
          />
        )}

        {/* Results */}
        {result && !sorting && (
          <ResultsList
            result={filteredResult}
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
    </>
  );
}
