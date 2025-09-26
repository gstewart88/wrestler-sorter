import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // ① pull in Bootstrap
import { Container } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Promotions from './pages/Promotions';
import './App.css';

export default function App() {
  return (
    <Container fluid className="p-0">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promotions" element={<Promotions />} />
      </Routes>
    </Container>
  );
}