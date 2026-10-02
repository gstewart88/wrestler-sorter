// src/pages/Promotions.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Promotions.scss';

const promotions = [
  {
    name: 'AEW',
    slug: 'aew',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/AEW/MercedesMone.webp'
  },
  {
    name: 'Marigold',
    slug: 'Marigold',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/Marigold/MikuAono.png'
  },
  {
    name: 'NJPW',
    slug: 'njpw',
    img: 'https://img.solowrestling.com/images/136/136715-yotaglobal.jpg'
  },
  {
    name: 'NXT',
    slug: 'nxt',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/NXT/GraysonWaller.webp'
  },
  {
    name: 'Raw',
    slug: 'raw',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/Raw/RomanReigns.webp'
  },
  {
    name: 'Smackdown',
    slug: 'smackdown',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/Smackdown/SamiZayn.webp'
  },
  {
    name: 'Stardom',
    slug: 'stardom',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/Stardom/SuzuSuzukiChampion.jpg'
  },
  {
    name: 'TJPW',
    slug: 'tjpw',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/TJPW/YukiArai.png'
  },
  {
    name: 'TNA',
    slug: 'tna',
    img: 'https://cdn.jsdelivr.net/gh/gstewart88/wrestler-images@main/images/promotions/TNA/NicNemeth.jpg'
  }
];

export default function Promotions() {
  return (
    <div className="promotions-container">
      {promotions.map(({ name, slug, img }) => (
        <Link
          key={slug}
          to={`/company/${slug}`}
          className="promo-card"
        >
            <img 
                src={img} 
                alt={name} 
            />
            <div className="card__head">{name}</div>
        </Link>
      ))}
    </div>
  );
}