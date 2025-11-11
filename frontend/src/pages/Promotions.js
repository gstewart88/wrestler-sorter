// src/pages/Promotions.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Promotions.scss';

const promotions = [
  {
    name: 'TJPW',
    slug: 'tjpw',
    img: 'https://pm1.aminoapps.com/9281/dec154040146a9c27f61c48b0e4a6ce74534468er1-900-600v2_hq.jpg'
  },
  {
    name: 'Marigold',
    slug: 'Marigold',
    img: 'https://monthlypuroresu.com/wp-content/uploads/2025/04/Utami-Hayashishita-champion-2-a.jpg'
  },
  {
    name: 'Smackdown',
    slug: 'smackdown',
    img: 'https://www.usanetwork.com/sites/usablog/files/2024/08/smackdown-cody-rhodes.jpg'
  },
  {
    name: 'Raw',
    slug: 'raw',
    img: 'https://www.wrestlingattitude.com/wp-content/uploads/2024/01/Seth-Rollins-NEW-1.jpg'
  },
  {
    name: 'Stardom',
    slug: 'stardom',
    img: 'https://monthlypuroresu.com/wp-content/uploads/2025/05/saya-kamitani-4.jpg'
  },
  {
    name: 'AEW',
    slug: 'aew',
    img: 'https://static.wixstatic.com/media/815952_edf4c83f122546e79e01bf047caf2024~mv2.jpg/v1/fill/w_568,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/815952_edf4c83f122546e79e01bf047caf2024~mv2.jpg'
  },
  {
    name: 'TNA',
    slug: 'tna',
    img: 'https://cdn.wrestletalk.com/wp-content/uploads/2025/05/trick-williams-tna-world-champion-may-26-b.jpg'
  },
  {
    name: 'NXT',
    slug: 'nxt',
    img: 'https://wrestlingnews.co/wp-content/uploads/2025/05/hq-Oba-Femi-21_2025-05-26_00-40-57.jpg'
  },
  // {
  //   name: 'CMLL',
  //   slug: 'cmll',
  //   img: 'https://www.luchawiki.org/images/2/2c/Cmllheavy_granguerrero.jpg'
  // },
  {
    name: 'NJPW',
    slug: 'njpw',
    img: 'https://www.wrestlinginc.com/img/gallery/why-wrestling-fans-shouldnt-expect-to-see-zack-sabre-jr-join-aew-or-wwe/l-intro-1736504530.jpg'
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