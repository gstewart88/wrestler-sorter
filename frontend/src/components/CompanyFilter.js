import React from 'react';
import './CompanyFilter.css';

const companyLogos = {
  AEW:      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/All_Elite_Wrestling_logo_2023.png/1600px-All_Elite_Wrestling_logo_2023.png',
  Raw:      'https://upload.wikimedia.org/wikipedia/commons/a/a5/WWE_RAW_Logo.png',
  Smackdown:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/WWE_SmackDown_%282024%29_Logo.svg/2560px-WWE_SmackDown_%282024%29_Logo.svg.png',
  NJPW:     'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/New_Japan_Pro_Wrestling_Logo_2.svg/1280px-New_Japan_Pro_Wrestling_Logo_2.svg.png',
  Stardom:  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Stardom_2021_logo.svg/260px-Stardom_2021_logo.svg.png',
  Marigold: 'https://dsf-marigold.com/wp-content/themes/marigold/assets/images/mg_logo2.png',
  TJPW:     'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/TJPW_logo.svg/480px-TJPW_logo.svg.png?20230218193820',
};

function CompanyFilter({ companies, selected, onToggle }) {
  return (
    <div className="company-filter">
      <h2>Company</h2>
      {companies.map(c => (
        <label key={c} className="company-item">
          <img
            src={companyLogos[c] || 'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'}
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
