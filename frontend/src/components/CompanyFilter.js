// src/components/CompanyFilter.js

import React from 'react';
import { Form } from 'react-bootstrap';
import './CompanyFilter.css';

/**
 * A single checkbox that can also render in an “indeterminate” (dash) state.
 */
function CompanyCheckbox({
  company,
  isChecked,
  isIndeterminate,
  onToggle,
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <Form.Check
      type="checkbox"
      id={`company-${company}`}
      label={company}
      checked={isChecked}
      onChange={() => onToggle(company)}
      ref={ref}
    />
  );
}

/**
 * Renders the list of company filters, each with three possible states:
 *  • checked      = all wrestlers from this company are in the preview
 *  • unchecked    = no wrestlers from this company are in the preview
 *  • indeterminate = some, but not all, wrestlers are in the preview
 *
 * Props:
 *  • companies:  array of company names
 *  • selected:   array of company names that are currently “included”
 *  • stats:      object mapping company → { total, shown }
 *  • onToggle:   fn(companyName) to include/exclude that company
 */
export default function CompanyFilter({
  companies,
  selected,
  stats = {},
  onToggle,
}) {
  return (
    <div className="company-filter">
      <strong>Companies</strong>
      {companies.map(company => {
        const { total = 0, shown = 0 } = stats[company] || {};
        const isIndeterminate = shown > 0 && shown < total;
        const isChecked       = selected.includes(company);

        return (
          <CompanyCheckbox
            key={company}
            company={company}
            isChecked={isChecked}
            isIndeterminate={isIndeterminate}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}
