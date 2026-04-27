import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

const Calculator = () => {
  // Ініціалізуємо стан першим шоломом та його стандартними опціями
  const [selectedHelmet, setSelectedHelmet] = useState(helmetsData[0]);
  const [optAv, setOptAv] = useState(helmetsData[0].options.aventail?.[0] || null);
  const [optPlates, setOptPlates] = useState(helmetsData[0].options.plates?.[0] || null);
  const [optDecor, setOptDecor] = useState(helmetsData[0].options.decoration?.[0] || null);
  const [clientContact, setClientContact] = useState('');

  // Функція вибору шолома: оновлюємо все одним махом (фікс помилки на скріншоті)
  const handleHelmetSelect = (h) => {
    setSelectedHelmet(h);
    setOptAv(h.options.aventail?.[0] || null);
    setOptPlates(h.options.plates?.[0] || null);
    setOptDecor(h.options.decoration?.[0] || null);
  };

  // Розрахунок загальної вартості
  const totalPrice = selectedHelmet.basePrice + 
    (optAv?.priceMod || 0) + 
    (optPlates?.priceMod || 0) + 
    (optDecor?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();

    if (!clientContact) {
      alert("Please enter your contact details (Email or Telegram)");
      return;
    }

    const templateParams = {
      helmet_name: selectedHelmet.name,
      options: `
        Aventail: ${optAv?.label || 'Standard'}, 
        Plates: ${optPlates?.label || 'Standard/None'}, 
        Decoration: ${optDecor?.label || 'Standard'}
      `,
      price: `€${totalPrice}`,
      contact: clientContact,
    };

    // Відправка через EmailJS
    emailjs.send(
      'YOUR_SERVICE_ID', 
      'YOUR_TEMPLATE_ID', 
      templateParams,
      'YOUR_PUBLIC_KEY'
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('SUCCESS! Order sent to the forge.');
        setClientContact('');
      })
      .catch((err) => {
        // Використовуємо err для логування (фікс ESLint)
        console.error('FAILED to send order:', err);
        alert('FAILED to send order. Check your connection or contact the master directly.');
      });
  };

  return (
    <div className="configurator">
      {/* Вибір моделі шолома */}
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
        <h3>{selectedHelmet.name} — Configuration</h3>
        <ul className="spec-list">
          <li><strong>Dome:</strong> {selectedHelmet.specs.dome}</li>
          <li><strong>Visor/Face:</strong> {selectedHelmet.specs.visor || selectedHelmet.specs.face}</li>
          
          {/* Опції бармиці (якщо є вибір) */}
          {selectedHelmet.options.aventail?.length > 0 ? (
            <li className="option-row">
              <strong>Aventail:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.aventail.map((a, i) => (
                  <button 
                    key={i} 
                    className={optAv?.label === a.label ? 'selected' : ''} 
                    onClick={() => setOptAv(a)}
                  >
                    {a.label} {a.priceMod > 0 ? `(+€${a.priceMod})` : ''}
                  </button>
                ))}
              </div>
            </li>
          ) : (
            <li><strong>Aventail:</strong> {selectedHelmet.specs.aventail}</li>
          )}

          {/* Опції захисних пластин */}
          {selectedHelmet.options.plates?.length > 0 && (
            <li className="option-row">
              <strong>Protective Plates:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.plates.map((p, i) => (
                  <button 
                    key={i} 
                    className={optPlates?.label === p.label ? 'selected' : ''} 
                    onClick={() => setOptPlates(p)}
                  >
                    {p.label} {p.priceMod > 0 ? `(+€${p.priceMod})` : ''}
                  </button>
                ))}
              </div>
            </li>
          )}

          {/* Опції декорації (чорніння, позолота) */}
          {selectedHelmet.options.decoration?.length > 0 && (
            <li className="option-row">
              <strong>Decoration Finish:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.decoration.map((d, i) => (
                  <button 
                    key={i} 
                    className={optDecor?.label === d.label ? 'selected' : ''} 
                    onClick={() => setOptDecor(d)}
                  >
                    {d.label} {d.priceMod > 0 ? `(+€${d.priceMod})` : ''}
                  </button>
                ))}
              </div>
            </li>
          )}
        </ul>

        {/* Секція замовлення */}
        <div className="order-section">
          <input 
            type="text" 
            className="calc-input"
            placeholder="Telegram @username or Email" 
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