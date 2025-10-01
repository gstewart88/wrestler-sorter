// src/components/MobileMockup.js

import React, { forwardRef } from 'react';

const MobileMockup = forwardRef(({ top, fave5, hated5 }, ref) => (
  <div
    ref={ref}
    style={{
      position:       'absolute',
      top:            -9999,
      left:           -9999,
      width:          '1080px',
      height:         '1920px',
      padding:        '16px',
      boxSizing:      'border-box',
      display:        'flex',
      flexDirection:  'column',
      background:     'linear-gradient(180deg, #fdfcfb 0%, #e2d1c3 100%)',
      fontFamily:     "'Inter', system-ui, sans-serif",
      color:          '#333',
      borderRadius:   '16px',
      boxShadow:      '0 8px 24px rgba(0,0,0,0.1)',
    }}
  >
    {/* 1. Title */}
    <h1
      style={{
        fontSize:     '72px',
        fontWeight:   700,
        textAlign:    'center',
        margin:       0,
        marginBottom: '24px',
        color:        '#222',
      }}
    >
      Fave Five
    </h1>

    {/* 2. Top wrestler image (fixed aspect, contain) */}
    <div
      style={{
        width:        '350px',
        height:       '350px',
        overflow:     'hidden',
        borderRadius: '8px',
        marginBottom: '24px',
        margin:       '0 auto',
        border:       `4px solid #2e7d32`,
      }}
    >
      <img
        src={top.imageURL}
        crossOrigin="anonymous"
        alt={top.name}
        onError={e =>
          (e.currentTarget.src =
            'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'
          )
        }
        style={{
          width:      '100%',
          height:     '100%',
          objectFit:       'cover',
          objectPosition:  'top center',
        }}
      />
    </div>
    <div
    style={{
        fontSize:       '36px',
        margin:       '0 auto 24px',
      }}
    >{top.name}</div>

    {/* 3. Two columns of lists */}
    <div
      style={{
        display:   'flex',
        gap:       '40px',
        overflow:  'hidden',
        margin:    '0 0 24px',
      }}
    >
      {[
        { title: 'Favorite Five', items: fave5,  color: '#2e7d32' },
        { title: 'Most Hated Five',  items: hated5, color: '#e03e3e' },
      ].map(({ title, items, color }) => (
        <div key={title} style={{ flex: 1, overflowY: 'auto' }}>
          <h2
            style={{
              fontSize:     '44px',
              margin:       0,
              marginBottom: '16px',
              textAlign:    'center',
              color,
            }}
          >
            {title}
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((w, i) => (
              <li
                key={w.name}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  marginBottom: '12px',
                }}
              >
                {/* Number circle */}
                <div
                  style={{
                    width:           '28px',
                    height:          '28px',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    borderRadius:    '50%',
                    backgroundColor: color,
                    color:           '#fff',
                    fontWeight:      700,
                    fontSize:        '32px',
                    marginRight:     '12px',
                  }}
                >
                  {i + 1}
                </div>

                {/* Name badge */}
                <div
                  style={{
                    flex:           1,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    backgroundColor:'#fff',
                    border:         `2px solid ${color}`,
                    borderRadius:   '8px',
                    padding:        '8px 12px',
                    fontSize:       '36px',
                    color:          '#333',
                  }}
                >
                  <span>{w.name}</span>
                  <div style={{
                        width:        '100px',
                        height:       '100px',
                        overflow:     'hidden',
                        borderRadius: '8px',
                        border:       `4px solid ${color}`,
                        alignSelf:    'center',
                        }}
                    >
                  <img
                  src={w.imageURL}
                  crossOrigin="anonymous"
                  alt={w.name}
                  onError={e =>
                    (e.currentTarget.src =
                      'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'
                    )
                  }
                  style={{
                    width:        '100%',
                    height:       '100%',
                    objectFit:    'contain',
                  }}
                />
                </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

        <div
      style={{
        width:        '350px',
        height:       '350px',
        overflow:     'hidden',
        borderRadius: '8px',
        margin:       '0 auto',
      }}
    >
      <img
        src={hated5[0].imageURL}
        crossOrigin="anonymous"
        alt={hated5[0].name}
        onError={e =>
          (e.currentTarget.src =
            'https://static.wikia.nocookie.net/cjdm-wrestling/images/0/0a/Vacant_Superstar.png'
          )
        }
        style={{
          width:      '100%',
          height:     '100%',
          objectFit:  'contain',
          border:     `4px solid #e03e3e`,
        }}
      />
    </div>
    <div
    style={{
        fontSize:       '36px',
        margin:       '0 auto 24px',
      }}
    >{hated5[0].name}</div>

    {/* 4. Footer badge */}
    <div
      style={{
        textAlign:  'center',
        fontSize:   '14px',
        color:      '#666',
        marginTop:  '24px',
      }}
    >
      Made with Fave-Five.app
    </div>
  </div>
));

export default MobileMockup;
