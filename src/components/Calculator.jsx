import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

const Calculator = () => {
  const [selectedHelmet, setSelectedHelmet] = useState(helmetsData[0]);
  const [optAv, setOptAv] = useState(helmetsData[0].options.aventail?.[0] || null);
  const [optPlates, setOptPlates] = useState(helmetsData[0].options.plates?.[0] || null);
  const [optDecor, setOptDecor] = useState(helmetsData[0].options.decoration?.[0] || null);
  
  const [headCirc, setHeadCirc] = useState('58'); 
  const [headWidth, setHeadWidth] = useState('16'); 
  const [clientContact, setClientContact] = useState('');

  // Функція з фіксом чисел (55.0 -> 55)
  const generateRange = (start, end, step) => {
    const range = [];
    for (let i = start; i <= end; i += step) {
      // Якщо число ціле — прибираємо крапку
      const val = Number.isInteger(i) ? i.toString() : i.toFixed(1);
      range.push(val);
    }
    return range;
  };

  const handleHelmetSelect = (h) => {
    setSelectedHelmet(h);
    setOptAv(h.options.aventail?.[0] || null);
    setOptPlates(h.options.plates?.[0] || null);
    setOptDecor(h.options.decoration?.[0] || null);
  };

  const totalPrice = selectedHelmet.basePrice + 
    (optAv?.priceMod || 0) + 
    (optPlates?.priceMod || 0) + 
    (optDecor?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();
    if (!clientContact) return alert("Enter contact info!");

    const templateParams = {
      helmet_name: selectedHelmet.name,
      measurements: `Circumference: ${headCirc}cm, Width: ${headWidth}cm`,
      options: `Av: ${optAv?.label || 'Std'}, Plates: ${optPlates?.label || 'Std'}, Finish: ${optDecor?.label || 'Std'}`,
      price: `€${totalPrice}`,
      contact: clientContact
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then(() => alert('Order sent to Gorilla Armor!'))
      .catch((err) => {
        console.error('EmailJS Error:', err);
        alert('Error sending order.');
      });
  };

  return (
    <div className="configurator">
      <div className="helmet-selector">
        {helmetsData.map(h => (
          <button 
            key={h.id} 
            className={`helmet-tab ${selectedHelmet.id === h.id ? 'active' : ''}`}
            onClick={() => handleHelmetSelect(h)}
          >
            {h.name}
          </button>
        ))}
      </div>

      <div className="spec-card">
        <h3>{selectedHelmet.name} — Configurator</h3>
        <ul className="spec-list">
          <li><strong>Base:</strong> <span>{selectedHelmet.specs.dome} / {selectedHelmet.specs.visor || selectedHelmet.specs.face}</span></li>
          
          {selectedHelmet.options.aventail?.length > 0 && (
            <li className="option-row">
              <strong>Aventail:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.aventail.map((a, i) => (
                  <button key={i} className={optAv?.label === a.label ? 'selected' : ''} onClick={() => setOptAv(a)}>
                    {a.label} {a.priceMod !== 0 && `(+€${a.priceMod})`}
                  </button>
                ))}
              </div>
            </li>
          )}

          <li className="option-row">
            <strong>Protective Plates:</strong>
            <div className="mini-buttons">
              {selectedHelmet.options.plates.map((p, i) => (
                <button key={i} className={optPlates?.label === p.label ? 'selected' : ''} onClick={() => setOptPlates(p)}>
                  {p.label} {p.priceMod !== 0 && `(+€${p.priceMod})`}
                </button>
              ))}
            </div>
          </li>

          <li className="option-row">
            <strong>Decoration Finish:</strong>
            <div className="mini-buttons">
              {selectedHelmet.options.decoration.map((d, i) => (
                <button key={i} className={optDecor?.label === d.label ? 'selected' : ''} onClick={() => setOptDecor(d)}>
                  {d.label} {d.priceMod !== 0 && `(+€${d.priceMod})`}
                </button>
              ))}
            </div>
          </li>

          <hr className="divider" />

          {/* БЛОК ЗАМІРІВ З НОВИМИ КЛАСАМИ */}
          <li className="measurements-container">
            <div className="m-field">
              <label>Head Circumference (cm)</label>
              <select className="armor-select" value={headCirc} onChange={(e) => setHeadCirc(e.target.value)}>
                {generateRange(54, 64, 0.5).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
            <div className="m-field">
              <label>Head Width (cm)</label>
              <select className="armor-select" value={headWidth} onChange={(e) => setHeadWidth(e.target.value)}>
                {generateRange(14, 18, 0.5).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </li>
        </ul>

        <div className="order-section">
          <input 
            type="text" 
            className="calc-input" 
            placeholder="Your Telegram or Email" 
            value={clientContact} 
            onChange={(e) => setClientContact(e.target.value)} 
          />
          <div className="price-tag">Total: €{totalPrice}</div>
          <button className="confirm-btn" onClick={sendOrder}>Forge My Helmet</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;