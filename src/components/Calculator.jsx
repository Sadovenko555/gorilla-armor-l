import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

// Об'єкт з цінами для кожного візерунка тканини
const patternPrices = {
  'Solid': 0,
  'Two-colored': 5,
  'Quartered': 7,
  'Bordered': 6
};

// Список доступних кольорів для тканини
const fabricColors = [
  { name: 'Red', hex: '#8b0000' },
  { name: 'Black', hex: '#222222' },
  { name: 'Blue', hex: '#1a365d' },
  { name: 'Green', hex: '#1c4532' },
  { name: 'White', hex: '#d9d9d9' }
];

// Компонент іконок, який тепер приймає обраний hex-колір
const PatternIcon = ({ type, colorHex }) => {
  const colorBase = "#111111"; // Базовий темний колір для розділення
  const colorPattern = colorHex; // Динамічний колір, який обрав користувач

  return (
    <svg width="44" height="44" viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* Зовнішнє тонке кільце */}
      <circle cx="50" cy="50" r="47" fill="none" stroke="#444" strokeWidth="2" />
      
      {/* 1. Цельний (Solid) */}
      {type === 'solid' && (
        <circle cx="50" cy="50" r="44" fill={colorPattern} />
      )}

      {/* 2. Двохколірний вертикальний (Split) */}
      {type === 'two-colored' && (
        <>
          <circle cx="50" cy="50" r="44" fill={colorBase} />
          <path d="M 50 6 A 44 44 0 0 0 50 94 Z" fill={colorPattern} />
        </>
      )}

      {/* 3. Поділений на 4 частини (Quartered) */}
      {type === 'quartered' && (
        <>
          <circle cx="50" cy="50" r="44" fill={colorBase} />
          <path d="M 50 50 L 6 50 A 44 44 0 0 1 50 6 Z" fill={colorPattern} />
          <path d="M 50 50 L 94 50 A 44 44 0 0 1 50 94 Z" fill={colorPattern} />
        </>
      )}

      {/* 4. З каймою по низу (Bordered) */}
      {type === 'bordered' && (
        <>
          <circle cx="50" cy="50" r="44" fill={colorPattern} />
          <circle cx="50" cy="50" r="30" fill={colorBase} />
        </>
      )}
    </svg>
  );
};

const Calculator = () => {
  const [selectedHelmet, setSelectedHelmet] = useState(helmetsData[0]);
  const [optAv, setOptAv] = useState(helmetsData[0].options.aventail?.[0] || null);
  const [optPlates, setOptPlates] = useState(helmetsData[0].options.plates?.[0] || null);
  const [optDecor, setOptDecor] = useState(helmetsData[0].options.decoration?.[0] || null);
  
  // Стейти для тканини (візерунок та колір)
  const [fabricPattern, setFabricPattern] = useState('Solid');
  const [selectedColor, setSelectedColor] = useState(fabricColors[0]); // Дефолтний: Червоний

  const [headCirc, setHeadCirc] = useState('58'); 
  const [headWidth, setHeadWidth] = useState('16'); 
  const [clientContact, setClientContact] = useState('');

  const generateRange = (start, end, step) => {
    const range = [];
    for (let i = start; i <= end; i += step) {
      const val = Number.isInteger(i) ? i.toString() : i.toFixed(1);
      range.push(val);
    }
    return range;
  };

  const handleHelmetChange = (h) => {
    setSelectedHelmet(h);
    const defaultAv = h.options.aventail?.[0] || null;
    setOptAv(defaultAv);
    setOptPlates(h.options.plates?.[0] || null);
    setOptDecor(h.options.decoration?.[0] || null);
    setFabricPattern('Solid'); 
    setSelectedColor(fabricColors[0]);
  };

  // Розрахунок модифікатора ціни для візерунка тканини
  const patternPriceMod = optAv?.label.includes('Fabric') ? (patternPrices[fabricPattern] || 0) : 0;

  // Загальна ціна тепер враховує базову ціну + опції + модифікатор тканини
  const totalPrice = selectedHelmet.basePrice + 
    (optAv?.priceMod || 0) + 
    patternPriceMod +
    (optPlates?.priceMod || 0) + 
    (optDecor?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();
    if (!clientContact) return alert("Please enter your contact info!");

    const aventailDetails = optAv 
      ? `${optAv.label}${optAv.label.includes('Fabric') ? ` (Pattern: ${fabricPattern}, Base Color: ${selectedColor.name})` : ''}`
      : 'None (Standard Chain Mail)';

    const templateParams = {
      helmet_name: selectedHelmet.name,
      name: clientContact,
      message: `
        Measurements: Circumference ${headCirc}cm, Width ${headWidth}cm.
        Aventail: ${aventailDetails}
        Plates: ${optPlates?.label || 'Standard'}
        Decoration: ${optDecor?.label || 'Classic'}
        Total Price: €${totalPrice}
      `
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then(() => alert('Order sent successfully!'))
      .catch(() => alert('Error sending order.'));
  };

  return (
    <div className="configurator">
      <div className="helmet-selector">
        {helmetsData.map(h => (
          <button 
            key={h.id} 
            className={`helmet-tab ${selectedHelmet.id === h.id ? 'active' : ''}`}
            onClick={() => handleHelmetChange(h)}
          >
            {h.name}
          </button>
        ))}
      </div>

      <div className="spec-card">
        <div className="config-main-layout">
          
          <div className="helmet-preview">
            <img 
              src={selectedHelmet.image} 
              alt={selectedHelmet.name} 
              key={selectedHelmet.id} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Image+Coming+Soon'; }}
            />
          </div>

          <div className="config-controls">
            <h3>{selectedHelmet.name} — Configurator</h3>
            <ul className="spec-list">
              <li>
                <strong>Dome:</strong>
                <div className="mini-buttons">
                  <div className="spec-static-btn">{selectedHelmet.specs.dome}</div>
                </div>
              </li>

              <li>
                <strong>{selectedHelmet.specs.visor ? 'Visor' : 'Face'}:</strong>
                <div className="mini-buttons">
                  <div className="spec-static-btn">{selectedHelmet.specs.visor || selectedHelmet.specs.face}</div>
                </div>
              </li>
              
              <li>
                <strong>Aventail:</strong>
                <div className="spec-options-wrapper">
                  {selectedHelmet.options.aventail && selectedHelmet.options.aventail.length > 0 ? (
                    <div className="mini-buttons">
                      {selectedHelmet.options.aventail.map((a, i) => (
                        <button key={i} className={optAv?.label === a.label ? 'selected' : ''} onClick={() => setOptAv(a)}>
                          {a.label} {a.priceMod !== 0 && `(+€${a.priceMod})`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mini-buttons">
                      <div className="spec-static-btn">{selectedHelmet.specs.aventail || 'Chain Mail (Standard)'}</div>
                    </div>
                  )}

                  {/* Розширений блок налаштування тканини */}
                  {optAv?.label.includes('Fabric') && (
                    <div className="fabric-patterns-container">
                      
                      {/* Вибір кольору авентайла */}
                      <span className="pattern-section-title">Fabric Color:</span>
                      <div className="color-picker-grid">
                        {fabricColors.map((color) => (
                          <button
                            key={color.name}
                            className={`color-dot ${selectedColor.name === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                        <span className="selected-color-name">{selectedColor.name}</span>
                      </div>

                      {/* Вибір візерунка з новими цінами */}
                      <span className="pattern-section-title" style={{ marginTop: '5px' }}>Fabric Pattern:</span>
                      <div className="pattern-grid">
                        {[
                          { id: 'Solid', label: 'Solid', price: 0 },
                          { id: 'Two-colored', label: 'Split', price: 5 },
                          { id: 'Quartered', label: 'Quarter', price: 7 },
                          { id: 'Bordered', label: 'Border', price: 6 }
                        ].map((p) => (
                          <div 
                            key={p.id} 
                            className={`pattern-card ${fabricPattern === p.id ? 'active' : ''}`}
                            onClick={() => setFabricPattern(p.id)}
                          >
                            {/* Передаємо поточний колір у фігуру SVG */}
                            <PatternIcon type={p.id.toLowerCase()} colorHex={selectedColor.hex} />
                            <span className="pattern-label">{p.label}</span>
                            <span className="pattern-price">{p.price === 0 ? 'Free' : `+€${p.price}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>

              <li>
                <strong>Protective Plates:</strong>
                <div className="mini-buttons">
                  {selectedHelmet.options.plates.map((p, i) => (
                    <button key={i} className={optPlates?.label === p.label ? 'selected' : ''} onClick={() => setOptPlates(p)}>
                      {p.label} {p.priceMod !== 0 && `(+€${p.priceMod})`}
                    </button>
                  ))}
                </div>
              </li>

              <li>
                <strong>Decoration Finish:</strong>
                <div className="mini-buttons">
                  {selectedHelmet.options.decoration.map((d, i) => (
                    <button key={i} className={optDecor?.label === d.label ? 'selected' : ''} onClick={() => setOptDecor(d)}>
                      {d.label} {d.priceMod !== 0 && `(+€${d.priceMod})`}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="divider" />

        <div className="measurements-container">
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
        </div>

        <div className="order-section">
          <input 
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