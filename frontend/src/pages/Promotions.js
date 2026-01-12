// src/pages/Promotions.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Promotions.scss';

const promotions = [
  {
    name: 'AEW',
    slug: 'aew',
    img: 'https://www.si.com/.image/t_share/MTkzOTA4OTU5MzM2MjExOTUy/mjf-aew-championship.jpg'
  },
  {
    name: 'Marigold',
    slug: 'Marigold',
    img: 'https://substackcdn.com/image/fetch/$s_!iSWo!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F47c77c2a-6c75-47f5-8027-e8a11fe90a10_2048x1072.jpeg'
  },
  {
    name: 'NJPW',
    slug: 'njpw',
    img: 'https://img.solowrestling.com/images/136/136715-yotaglobal.jpg'
  },
  {
    name: 'NXT',
    slug: 'nxt',
    img: 'https://www.wrestlezone.com/wp-content/uploads/sites/8/2025/07/jacy-jayne-tna-slammiversary.jpg'
  },
  {
    name: 'Raw',
    slug: 'raw',
    img: 'https://www.tpww.net/wp-content/uploads/2025/11/CM-Punk-2.jpg'
  },
  {
    name: 'Smackdown',
    slug: 'smackdown',
    img: 'https://assets.newsweek.com/wp-content/uploads/2025/08/2619048-wwe-drew-mcintyre-wrestlemania.jpg?w=1600&quality=80&webp=1'
  },
  {
    name: 'Stardom',
    slug: 'stardom',
    img: 'https://monthlypuroresu.com/wp-content/uploads/2025/05/saya-kamitani-4.jpg'
  },
  {
    name: 'TJPW',
    slug: 'tjpw',
    img: 'https://catch-news.fr/images/2025/08/24/miu-watanabe-s-adjuge-la-tokyo-princess-cup-2025.jpg'
  },
  {
    name: 'TNA',
    slug: 'tna',
    img: 'https://www.wrestleview.com/wp-content/uploads/2025/11/kaztnachamp-1160x653.jpg'
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