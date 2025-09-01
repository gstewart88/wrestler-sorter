import React from 'react';
import './CompanyFilter.css';

const companyLogos = {
  AEW:      '/images/companies/AEW.png',
  WWE:      '/images/companies/WWE.png',
  NJPW:     '/images/companies/NJPW.png',
  Stardom:  '/images/companies/Stardom.png',
  Marigold: '/images/companies/Marigold.png',
  TJPW:     '/images/companies/TJPW.png',
};

function CompanyFilter({ companies, selected, onToggle }) {
  return (
    <div className="company-filter">
      <h2>Filter by Company</h2>
      {companies.map(c => (
        <label key={c} className="company-item">
          <img
            src={companyLogos[c] || '/images/companies/placeholder.png'}
            alt={c + ' logo'}
            className="company-logo"
          />
          <input
            type="checkbox"
            checked={selected.includes(c)}
            onChange={() => onToggle(c)}
          />
          {c}
        </label>
      ))}
    </div>
  );
}

export default CompanyFilter;
