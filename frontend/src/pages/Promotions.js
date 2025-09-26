import React from 'react'
import './Promotions.scss'

export default function Promotions() {
  return (
    <div className="promotions-container">
      <div className="promo-card">
        <img
          src="https://pm1.aminoapps.com/9281/dec154040146a9c27f61c48b0e4a6ce74534468er1-900-600v2_hq.jpg"
          alt="Miu Watanabe"
        />
        <div className="card__head">TJPW</div>
      </div>

      <div className="promo-card">
        <img
          src="https://www.usanetwork.com/sites/usablog/files/2024/08/smackdown-cody-rhodes.jpg"
          alt="Cody Rhodes"
        />
        <div className="card__head">Smackdown</div>
      </div>

      <div className="promo-card">
        <img
          src="https://images2.minutemediacdn.com/image/upload/c_crop,x_0,y_0,w_3895,h_2190/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/87/01k237gqa2yvnym9pv04.jpg"
          alt="Seth Rollins"
        />
        <div className="card__head">Raw</div>
      </div>

      <div className="promo-card">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/SayaKamitani2025.jpg"
          alt="Saya Kamitani"
        />
        <div className="card__head">Stardom</div>
      </div>

      <div className="promo-card">
        <img
          src="https://static.wixstatic.com/media/815952_edf4c83f122546e79e01bf047caf2024~mv2.jpg/v1/fill/w_568,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/815952_edf4c83f122546e79e01bf047caf2024~mv2.jpg"
          alt="Hangman Adam Page"
        />
        <div className="card__head">AEW</div>
      </div>
    </div>
  )
}

