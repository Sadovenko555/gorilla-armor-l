import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

const Calculator = () => {
  const [selectedHelmet, setSelectedHelmet] = useState(helmetsData[0]);
  // Зберігаємо цілі об'єкти опцій, щоб знати і ціну, і назву
  const [selectedRod, setSelectedRod] = useState(selectedHelmet.options.rods[0] || null);
  const [selectedAv, setSelectedAv] = useState(selectedHelmet.options.aventail[0] || null);
  const [clientContact, setClientContact] = useState('');

  // Розрахунок ціни: база + ціна за прути + ціна за бармицю
  const totalPrice = selectedHelmet.basePrice + (selectedRod?.priceMod || 0) + (selectedAv?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();

    if (!clientContact) {
      alert("Please enter your contact details (Email or Telegram)");
      return;
    }

    // Формуємо рядок з вибраними опціями для листа
    const optionsText = [
      selectedRod ? `Rods: ${selectedRod.label}` : "Standard Visor",
      selectedAv ? `Aventail: ${selectedAv.label}` : `Aventail: ${selectedHelmet.specs.aventail}`
    ].join(', ');

    const templateParams = {
      helmet_name: selectedHelmet.name,
      options: optionsText,
      price: `€${totalPrice}`,
      contact: clientContact,
    };

    // ВСТАВ СВОЇ ID СЮДИ
    emailjs.send(
      'service_tmndiym', // Твій Service ID
      'template_dksx62t', // Твій Template ID
      templateParams,
      'QQpVRTj7aSUlz_3-2'   // Твій Public Key
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('SUCCESS! Your order has been sent to the master.');
        setClientContact(''); // Очистити поле після відправки
      }, (err) => {
        console.log('FAILED...', err);
        alert('FAILED to send order. Please try again or contact via Telegram.');
      });
  };

  return (
    <div className="configurator">
      <div className="helmet-selector">
        {helmetsData.map(h => (
          <button 
            key={h.id} 
            className={`helmet-tab ${selectedHelmet.id === h.id ? 'active' : ''}`}
            onClick={() => { 
              setSelectedHelmet(h); 
              setSelectedRod(h.options.rods[0] || null); 
              setSelectedAv(h.options.aventail[0] || null); 
            }}
          >
            {h.name}
          </button>
        ))}
      </div>

      <div className="spec-card">
        <h3>{selectedHelmet.name} — Full Specifications</h3>
        <ul className="spec-list">
          <li><strong>Dome:</strong> {selectedHelmet.specs.dome}</li>
          <li><strong>Visor/Face:</strong> {selectedHelmet.specs.visor || selectedHelmet.specs.face}</li>
          <li><strong>Liner:</strong> {selectedHelmet.specs.liner}</li>
          
          {selectedHelmet.options.rods.length > 0 && (
            <li className="option-row">
              <strong>Steel Rods:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.rods.map((r, i) => (
                  <button 
                    key={i} 
                    className={selectedRod?.label === r.label ? 'selected' : ''} 
                    onClick={() => setSelectedRod(r)}
                  >
                    {r.label} {r.priceMod > 0 ? `(+€${r.priceMod})` : ''}
                  </button>
                ))}
              </div>
            </li>
          )}

          {selectedHelmet.options.aventail.length > 0 ? (
            <li className="option-row">
              <strong>Aventail:</strong>
              <div className="mini-buttons">
                {selectedHelmet.options.aventail.map((a, i) => (
                  <button 
                    key={i} 
                    className={selectedAv?.label === a.label ? 'selected' : ''} 
                    onClick={() => setSelectedAv(a)}
                  >
                    {a.label} {a.priceMod > 0 ? `(+€${a.priceMod})` : ''}
                  </button>
                ))}
              </div>
            </li>
          ) : (
            <li><strong>Aventail:</strong> {selectedHelmet.specs.aventail}</li>
          )}
        </ul>

        <div className="order-section">
          <input 
            type="text" 
            className="calc-input"
            placeholder="Your Email" 
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
          />
          <div className="price-tag">Total: €{totalPrice}</div>
          <button className="confirm-btn" onClick={sendOrder}>Confirm & Send Order</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;