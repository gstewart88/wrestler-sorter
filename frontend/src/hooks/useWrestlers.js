import { useState, useEffect } from 'react';

export default function useWrestlers() {
  const [wrestlers, setWrestlers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const parts = [
      'aew',
      'marigold',
      'njpw',
      'stardom',
      'tjpw',
      'raw',
      'smackdown'
    ];

    Promise.all(
      parts.map(key =>
        fetch(`${process.env.PUBLIC_URL}/${key}.json`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to load ${key}.json`);
            return res.json();
          })
      )
    )
      .then(arrays => {
        const all = arrays.flat();
        setWrestlers(all);

        const uniqueCompanies = [
          ...new Set(all.map(w => w.company))
        ].filter(Boolean);
        setCompanies(uniqueCompanies);
      })
      .catch(err => {
        console.error('Error loading wrestler data:', err);
      });
  }, []);

  return { wrestlers, companies };
}
