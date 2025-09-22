// src/hooks/useWrestlers.js

import { useState, useEffect } from 'react';
import { IMAGES_CDN } from '../config';

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
        // flatten all arrays into one
        const allRaw = arrays.flat();

        // rewrite each wrestler’s imageURL to point at our CDN using the uniform filename
        const all = allRaw.map(w => {
          return {
            ...w,
            imageURL: `${IMAGES_CDN}/${w.filename}`
          };
        });

        setWrestlers(all);

        // extract unique, non-empty company names
        const uniqueCompanies = [
          ...new Set(all.map(w => w.company).filter(Boolean))
        ];
        setCompanies(uniqueCompanies);
      })
      .catch(err => {
        console.error('Error loading wrestler data:', err);
      });
  }, []);

  return { wrestlers, companies };
}
