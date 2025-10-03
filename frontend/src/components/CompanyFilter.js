import React from 'react';
import { Form } from 'react-bootstrap';
import './CompanyFilter.css';

 const companyLogos = {
  AEW:      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/All_Elite_Wrestling_logo_2023.png/1600px-All_Elite_Wrestling_logo_2023.png',
  Raw:      'https://upload.wikimedia.org/wikipedia/commons/a/a5/WWE_RAW_Logo.png',
  Smackdown:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/WWE_SmackDown_%282024%29_Logo.svg/2560px-WWE_SmackDown_%282024%29_Logo.svg.png',
  NXT:      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/WWE_NXT_2024_Logo.svg/598px-WWE_NXT_2024_Logo.svg.png',
  TNA:      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/TNA_Wrestling_%282024%29_Logo.svg/1024px-TNA_Wrestling_%282024%29_Logo.svg.png',
  NJPW:     'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/New_Japan_Pro_Wrestling_Logo_2.svg/1280px-New_Japan_Pro_Wrestling_Logo_2.svg.png',
  Stardom:  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Stardom_2021_logo.svg/260px-Stardom_2021_logo.svg.png',
  Marigold: 'https://dsf-marigold.com/wp-content/themes/marigold/assets/images/mg_logo2.png',
  TJPW:     'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/TJPW_logo.svg/480px-TJPW_logo.svg.png?20230218193820',
  CMLL:     'https://static.wikia.nocookie.net/prowrestling/images/c/c9/CMLLlogo2018.png'
};

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
