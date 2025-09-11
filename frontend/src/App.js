import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // ① pull in Bootstrap
import { Container } from 'react-bootstrap';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    // fluid + p-0 makes it edge-to-edge; child components control gutters
    <Container fluid className="p-0">
      <Home />
    </Container>
  );
}