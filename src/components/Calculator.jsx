import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

// Розширена палітра з 10 кольорів
const fabricColors = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#737373' },
  { name: 'Red', hex: '#8b0000' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Blue', hex: '#1e3a8a' },
  { name: 'Green', hex: '#14532d' },
  { name: 'Purple', hex: '#581c87' },
  { name: 'Light Blue', hex: '#0284c7' },
  { name: 'Brown', hex: '#451a03' }
];

const patternPrices = {
  'Solid': 0,
  'Two-colored': 5,
  'Quartered': 7,
  'Bordered': 6
};

// Компонент іконки, який тепер приймає два кольори одночасно
const PatternIcon = ({ type, primaryHex, secondaryHex }) => {
  const pColor = primaryHex;
  const sColor = secondaryHex || "#111111";

  return (
    <svg width="44" height="44" viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* Зовнішнє тонке кільце-обводка */}
      <circle cx="50" cy="50" r="47" fill="none" stroke="#444" strokeWidth="2" />
      
      {/* 1. Цельний (Solid) */}
      {type === 'solid' && (
        <circle cx="50" cy="50" r="44" fill={pColor} />
      )}

      {/* 2. Двохколірний вертикальний (Split) */}
      {type === 'two-colored' && (
        <>
          <circle cx="50" cy="50" r="44" fill={sColor} />
          <path d="M 50 6 A 44 44 0 0 0 50 94 Z" fill={pColor} />
        </>
      )}

      {/* 3. Поділений на 4 частини (Quartered) */}
      {type === 'quartered' && (
        <>
          <circle cx="50" cy="50" r="44" fill={sColor} />
          <path d="M 50 50 L 6 50 A 44 44 0 0 1 50 6 Z" fill={pColor} />
          <path d="M 50 50 L 94 50 A 44 44 0 0 1 50 94 Z" fill={pColor} />
        </>
      )}

      {/* 4. З каймою по низу (Bordered) — другий колір йде на зовнішнє коло (низ) */}
      {type === 'bordered' && (
        <>
          <circle cx="50" cy="50" r="44" fill={sColor} />
          <circle cx="50" cy="50" r="30" fill={pColor} />
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
  
  // Стейти для тканини
  const [fabricPattern, setFabricPattern] = useState('Solid');
  const [primaryColor, setPrimaryColor] = useState(fabricColors[3]); // Дефолт: Червоний
  const [secondaryColor, setSecondaryColor] = useState(fabricColors[0]); // Дефолт: Чорний

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
    setPrimaryColor(fabricColors[3]);
    setSecondaryColor(fabricColors[0]);
  };

  const patternPriceMod = optAv?.label.includes('Fabric') ? (patternPrices[fabricPattern] || 0) : 0;

  const totalPrice = selectedHelmet.basePrice + 
    (optAv?.priceMod || 0) + 
    patternPriceMod +
    (optPlates?.priceMod || 0) + 
    (optDecor?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();
    if (!clientContact) return alert("Please enter your contact info!");

    // Формуємо деталі кольорів залежно від візерунка
    const colorDetails = fabricPattern === 'Solid' 
      ? `Color: ${primaryColor.name}`
      : `Main Color: ${primaryColor.name}, Secondary Color: ${secondaryColor.name}`;

    const aventailDetails = optAv 
      ? `${optAv.label}${optAv.label.includes('Fabric') ? ` (Pattern: ${fabricPattern}, ${colorDetails})` : ''}`
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

                  {/* Блок кастомізації тканини */}
                  {optAv?.label.includes('Fabric') && (
                    <div className="fabric-patterns-container">
                      
                      {/* ПЕРШИЙ КОЛІР */}
                      <span className="pattern-section-title">Main Color:</span>
                      <div className="color-picker-grid">
                        {fabricColors.map((color) => (
                          <button
                            key={`primary-${color.name}`}
                            className={`color-dot ${primaryColor.name === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            onClick={() => setPrimaryColor(color)}
                          />
                        ))}
                        <span className="selected-color-name">{primaryColor.name}</span>
                      </div>

                      {/* ДРУГИЙ КОЛІР (показується тільки якщо обрано не суцільний візерунок) */}
                      {fabricPattern !== 'Solid' && (
                        <>
                          <span className="pattern-section-title" style={{ marginTop: '4px' }}>Secondary Color:</span>
                          <div className="color-picker-grid">
                            {fabricColors.map((color) => (
                              <button
                                key={`secondary-${color.name}`}
                                className={`color-dot ${secondaryColor.name === color.name ? 'active' : ''}`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                                onClick={() => setSecondaryColor(color)}
                              />
                            ))}
                            <span className="selected-color-name">{secondaryColor.name}</span>
                          </div>
                        </>
                      )}

                      {/* ВИБІР ВІЗЕРУНКА */}
                      <span className="pattern-section-title" style={{ marginTop: '6px' }}>Fabric Pattern:</span>
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
                            {/* Передаємо обидва кольори в SVG фігуру */}
                            <PatternIcon 
                              type={p.id.toLowerCase()} 
                              primaryHex={primaryColor.hex} 
                              secondaryHex={secondaryColor.hex} 
                            />
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