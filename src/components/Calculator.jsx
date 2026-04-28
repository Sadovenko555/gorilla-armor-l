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

  // ВИПРАВЛЕНО: Оновлюємо все в одному обробнику без useEffect
  const handleHelmetChange = (h) => {
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
    if (!clientContact) return alert("Please enter your contact info!");

    // ВИПРАВЛЕНО: Параметри під твій шаблон (image_2d9ed8.png)
    const templateParams = {
      helmet_name: selectedHelmet.name,
      name: clientContact, // Використовуємо контакт як ім'я
      email: clientContact, // Для поля Reply To
      message: `
        Measurements: Circ ${headCirc}cm, Width ${headWidth}cm.
        Aventail: ${optAv?.label || 'None'}
        Plates: ${optPlates?.label || 'Standard'}
        Decoration: ${optDecor?.label || 'Classic'}
      `
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then(() => alert('Order sent!'))
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
        <h3>{selectedHelmet.name} — Configurator</h3>
        <ul className="spec-list">
          {/* ВИПРАВЛЕНО: Назви Dome та Visor на місці */}
          <li>
            <strong>Base Specs:</strong> 
            <span>
              <strong>Dome:</strong> {selectedHelmet.specs.dome} | 
              <strong> {selectedHelmet.specs.visor ? 'Visor' : 'Face'}:</strong> {selectedHelmet.specs.visor || selectedHelmet.specs.face}
            </span>
          </li>
          
          {selectedHelmet.options.aventail?.length > 0 && (
            <li>
              <strong>Aventail:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.aventail.map((a, i) => (
                  <button key={i} className={optAv?.label === a.label ? 'selected' : ''} onClick={() => setOptAv(a)}>
                    {a.label}
                  </button>
                ))}
              </div>
            </li>
          )}

          <li>
            <strong>Protective Plates:</strong>
            <div className="mini-buttons">
              {selectedHelmet.options.plates.map((p, i) => (
                <button key={i} className={optPlates?.label === p.label ? 'selected' : ''} onClick={() => setOptPlates(p)}>
                  {p.label}
                </button>
              ))}
            </div>
          </li>
        </ul>

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