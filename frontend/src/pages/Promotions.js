// src/pages/Promotions.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Promotions() {
  return (
    <div className="p-4">
      <h1>Promotions</h1>
      <p>Here’s where your promo content lives.</p>
      <Link to="/">
        <Button variant="secondary">← Back Home</Button>
      </Link>
    </div>
  );
}
