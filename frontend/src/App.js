// src/App.js
import React, { useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Promotions from './pages/Promotions';
import CompanyRoster from './pages/CompanyRoster';
import MatchesPage from './pages/MatchesPage';
import MatchDetail from './pages/MatchDetail';
import './App.css';

export default function App() {
  useLayoutEffect(() => {
    const setHeaderHeight = () => {
      const headerEl = document.querySelector('header');
      const h = headerEl ? headerEl.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty('--app-header-height', `${h}px`);
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    return () => window.removeEventListener('resize', setHeaderHeight);
  }, []);

  return (
    <Container fluid className="p-0">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/company/:slug" element={<CompanyRoster />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
        </Routes>
      </main>
    </Container>
  );
}
