// frontend/src/pages/Home.js

import React, { useState, useEffect } from 'react';
import CompanyFilter from '../components/CompanyFilter';
import ComparisonPrompt from '../components/ComparisonPrompt';
import fordJohnsonSort from '../utils/fordJohnsonSort';
import WrestlerGrid     from '../components/WrestlerGrid';
import ResultsList from '../components/ResultsList';
import './Home.css';    // ← make sure this exists

export default function Home() {
  const [wrestlers, setWrestlers]         = useState([]);
  const [companies, setCompanies]         = useState([]);
  const [selectedCompanies, setSelected]  = useState(['WWE']);
  const [showAll, setShowAll] = useState(false);

  // Sidebar open/close
  const [filterOpen, setFilterOpen]       = useState(false);

  // Sorting state
  const [totalQs, setTotalQs]             = useState(0);
  const [currentQ, setCurrentQ]           = useState(0);
  const [sorting, setSorting]             = useState(false);
  const [currentPair, setCurrentPair]     = useState(null);
  const [awaitingResponse, setAwaiting]   = useState(null);
  const [result, setResult]               = useState(null);

  // fetch roster & companies
  useEffect(() => {
    fetch('http://localhost:3001/api/wrestlers')
      .then(r => r.json())
      .then(data => {
        setWrestlers(data);
        const unique = [...new Set(data.map(w => w.company))].filter(Boolean);
        setCompanies(unique);
      });
  }, []);

  // toggle companies in the filter
  function toggleCompany(c) {
    setSelected(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  }

  // only show wrestlers in selected companies
  const filtered = wrestlers.filter(w => selectedCompanies.includes(w.company));

  // Prompts user to pick between a & b
  function compareUser(a, b) {
    return new Promise(resolve => {
      setCurrentPair({ a, b });
      setAwaiting(() => resolve);
    });
  }

  // start the sort (dummy run to count, then real run)
  async function handleStart() {
    setSorting(true);

    // dry run to count
    let dummyCount = 0;
    const dummyCompare = async (a, b) => {
      dummyCount++;
      return a;
    };
    await fordJohnsonSort(filtered, dummyCompare);

    setTotalQs(dummyCount);
    setCurrentQ(0);

    // real run with prompts
    const sorted = await fordJohnsonSort(filtered, compareUser);
    setResult(sorted);
    setSorting(false);
  }

  // user clicked an option
  function handleChoice(chosen) {
    if (!awaitingResponse) return;

    const resolve = awaitingResponse;
    setAwaiting(null);
    setCurrentPair(null);
    resolve(chosen);

    setCurrentQ(q => q + 1);
  }

  return (
    <div className="home-container">

      {/* Hamburger for small screens */}
      <button
        className="hamburger"
        aria-label="Toggle filter"
        onClick={() => setFilterOpen(o => !o)}
      >
        ☰
      </button>

      {/* Backdrop when sidebar is open on mobile */}
      {filterOpen && <div className="backdrop" onClick={() => setFilterOpen(false)} />}

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${filterOpen ? 'open' : ''}`}>
        <CompanyFilter
          companies={companies}
          selected={selectedCompanies}
          onToggle={toggleCompany}
        />
      </aside>

      {/* Main Content */}
      <main className="content">
        <h1>Wrestler Sorter</h1>

        <button
          onClick={handleStart}
          disabled={!selectedCompanies.length || sorting}
          style={{ marginTop: 16 }}
        >
          {sorting ? 'Sorting…' : 'Start Sorting'}
        </button>

        {/* Comparison Overlay */}
        {sorting && currentPair && (
          <ComparisonPrompt
            a={currentPair.a}
            b={currentPair.b}
            onChoose={handleChoice}
          />
        )}

    {/* Results */}
    {result && !sorting && <ResultsList result={result} />}


        {/* Preview */}
        {!sorting && !result && (
          <div style={{ marginTop: 24 }}>
            <h3>Preview ({filtered.length})</h3>
            <WrestlerGrid wrestlers={filtered} />
          </div>
        )}
      </main>
    </div>
  );
}
