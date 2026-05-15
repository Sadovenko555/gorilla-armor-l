import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

// Компонент графічних іконок для візерунків тканини на основі твого ескізу
const PatternIcon = ({ type }) => {
  const colorBase = "#252525"; // Темна основа
  const colorPattern = "var(--primary-red)"; // Червоний колір візерунка

  return (
    <svg width="44" height="44" viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* Зовнішнє тонке кільце-обводка */}
      <circle cx="50" cy="50" r="47" fill="none" stroke="#444" strokeWidth="2" />
      
      {/* 1. Цельний (Solid) */}
      {type === 'solid' && (
        <circle cx="50" cy="50" r="44" fill={colorPattern} />
      )}

      {/* 2. Двохколірний вертикальний (Two-colored) */}
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
          {/* Верхня ліва чверть */}
          <path d="M 50 50 L 6 50 A 44 44 0 0 1 50 6 Z" fill={colorPattern} />
          {/* Нижня права чверть */}
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
  
  // Новий стейт для типу візерунка тканини
  const [fabricPattern, setFabricPattern] = useState('Solid');

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
    setFabricPattern('Solid'); // скидуємо на дефолт при зміні шолома
  };

  const totalPrice = selectedHelmet.basePrice + 
    (optAv?.priceMod || 0) + 
    (optPlates?.priceMod || 0) + 
    (optDecor?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();
    if (!clientContact) return alert("Please enter your contact info!");

    // Формуємо рядок авентайла з урахуванням типу тканини
    const aventailDetails = optAv 
      ? `${optAv.label}${optAv.label.includes('Fabric') ? ` (Pattern: ${fabricPattern})` : ''}`
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
                  {/* Перевірка чи є взагалі опції вибору опцій кольчуги/тканини */}
                  {selectedHelmet.options.aventail && selectedHelmet.options.aventail.length > 0 ? (
                    <div className="mini-buttons">
                      {selectedHelmet.options.aventail.map((a, i) => (
                        <button key={i} className={optAv?.label === a.label ? 'selected' : ''} onClick={() => setOptAv(a)}>
                          {a.label} {a.priceMod !== 0 && `(+€${a.priceMod})`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Якщо масив порожній (як у English Cross), виводимо статичний кастомний напис */
                    <div className="mini-buttons">
                      <div className="spec-static-btn">{selectedHelmet.specs.aventail || 'Chain Mail (Standard)'}</div>
                    </div>
                  )}

                  {/* Додатковий графічний вибір візерунка, якщо активована тканина */}
                  {optAv?.label.includes('Fabric') && (
                    <div className="fabric-patterns-container">
                      <span className="pattern-section-title">Fabric Pattern:</span>
                      <div className="pattern-grid">
                        {[
                          { id: 'Solid', label: 'Solid' },
                          { id: 'Two-colored', label: 'Split' },
                          { id: 'Quartered', label: 'Quartered' },
                          { id: 'Bordered', label: 'Bordered' }
                        ].map((p) => (
                          <div 
                            key={p.id} 
                            className={`pattern-card ${fabricPattern === p.id ? 'active' : ''}`}
                            onClick={() => setFabricPattern(p.id)}
                          >
                            <PatternIcon type={p.id.toLowerCase()} />
                            <span className="pattern-label">{p.label}</span>
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