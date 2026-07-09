import { useState } from 'react';
import { helmetsData } from '../data/helmets';
import emailjs from '@emailjs/browser';

const fabricColors = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#737373' },
  { name: 'Red', hex: '#8b0000' },
  { name: 'Orange', hex: '#e65c00' },
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

const PatternIcon = ({ type, primaryHex, secondaryHex }) => {
  const pColor = primaryHex;
  const sColor = secondaryHex || "#111111";

  return (
    <svg width="44" height="44" viewBox="0 0 100 100" style={{ display: 'block' }}>
      {type === 'solid' && <circle cx="50" cy="50" r="44" fill={pColor} />}
      {type === 'two-colored' && (
        <>
          <circle cx="50" cy="50" r="44" fill={sColor} />
          <path d="M 50 6 A 44 44 0 0 0 50 94 Z" fill={pColor} />
        </>
      )}
      {type === 'quartered' && (
        <>
          <circle cx="50" cy="50" r="44" fill={sColor} />
          <path d="M 50 50 L 6 50 A 44 44 0 0 1 50 6 Z" fill={pColor} />
          <path d="M 50 50 L 94 50 A 44 44 0 0 1 50 94 Z" fill={pColor} />
        </>
      )}
      {type === 'bordered' && (
        <>
          <circle cx="50" cy="50" r="44" fill={sColor} />
          <circle cx="50" cy="50" r="36" fill={pColor} />
        </>
      )}
      <circle cx="50" cy="50" r="16" fill="#151515" stroke="#444" strokeWidth="2" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="#444" strokeWidth="2" />
    </svg>
  );
};

const Calculator = () => {
  const [selectedHelmet, setSelectedHelmet] = useState(helmetsData[0]);
  const [optChin, setOptChin] = useState(helmetsData[0].options.chinPlate?.[0] || null);
  const [optAv, setOptAv] = useState(helmetsData[0].options.aventail?.[0] || null);
  const [optPlates, setOptPlates] = useState(helmetsData[0].options.plates?.[0] || null);
  const [optDecor, setOptDecor] = useState(helmetsData[0].options.decoration?.[0] || null);
  
  const [fabricPattern, setFabricPattern] = useState('Solid');
  const [primaryColor, setPrimaryColor] = useState(fabricColors[3]); 
  const [secondaryColor, setSecondaryColor] = useState(fabricColors[0]); 
  const [embroidery, setEmbroidery] = useState('Without Embroidery');

  const [headCirc, setHeadCirc] = useState('58'); 
  const [headWidth, setHeadWidth] = useState('16'); 

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

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
    setOptChin(h.options.chinPlate?.[0] || null);
    const defaultAv = h.options.aventail?.[0] || null;
    setOptAv(defaultAv);
    setOptPlates(h.options.plates?.[0] || null);
    setOptDecor(h.options.decoration?.[0] || null);
    setFabricPattern('Solid'); 
    setPrimaryColor(fabricColors[3]);
    setSecondaryColor(fabricColors[0]);
    setEmbroidery('Without Embroidery');
  };

  const patternPriceMod = optAv?.label.includes('Fabric') ? (patternPrices[fabricPattern] || 0) : 0;

  const totalPrice = selectedHelmet.basePrice + 
    (optChin?.priceMod || 0) +
    (optAv?.priceMod || 0) + 
    patternPriceMod +
    (optPlates?.priceMod || 0) + 
    (optDecor?.priceMod || 0);

  const sendOrder = (e) => {
    e.preventDefault();
    
    if (!fullName || !email || !country || !city || !address || !zipCode) {
      return alert("Please fill in all the shipping and contact details!");
    }

    setIsSending(true);

    const primaryColorName = primaryColor?.name || primaryColor?.label || 'Not selected';
    const secondaryColorName = secondaryColor?.name || secondaryColor?.label || 'Not selected';

    const colorDetails = fabricPattern === 'Solid' 
      ? `Color: ${primaryColorName}`
      : `Main Color: ${primaryColorName}, Secondary Color: ${secondaryColorName}`;

    const isFabric = optAv?.label && optAv.label.includes('Fabric');
    const embroideryDetails = isFabric ? `, Embroidery: ${embroidery || 'Without Embroidery'}` : '';
    
    const aventailDetails = optAv?.label
      ? `${optAv.label}${isFabric ? ` (Pattern: ${fabricPattern || 'Solid'}, ${colorDetails}${embroideryDetails})` : ''}`
      : 'None (Standard Chain Mail)';

    // Логика определения защитной пластины для EmailJS
    let chinPlateDetails = 'Not applicable';
    if (selectedHelmet.specs.chinPlate) {
      chinPlateDetails = 'Included by default';
    } else if (optChin) {
      chinPlateDetails = optChin.label;
    }

    const templateParams = {
      helmet_name: selectedHelmet?.name || selectedHelmet?.label || 'Spoleto', 
      price: totalPrice ? `€${totalPrice}` : '0',
      weight: selectedHelmet.specs.weight || '7 kg ± 0.3 kg',
      measurements: `Circumference ${headCirc || 0}cm, Width ${headWidth || 0}cm`,
      chin_plate: chinPlateDetails,
      aventail: aventailDetails,
      plates: optPlates?.label || optPlates?.name || 'Standard',
      decoration: optDecor?.label || optDecor?.name || 'Classic',
      client_name: fullName,
      client_email: email,
      shipping_country: country,
      shipping_city: city,
      shipping_address: address,
      shipping_zip: zipCode,
      client_notes: notes || 'No additional notes'
    };

    console.log("=== INITIATING EMAILJS ORDER PROCESS ===");
    console.log(templateParams);

    emailjs.send('service_g88mmxa', 'template_dksx62t', templateParams, 'QQpVRTj7aSUlz_3-2')
      .then((adminResponse) => {
        console.log('1. Admin Notification Sent:', adminResponse);
        return emailjs.send('service_g88mmxa', 'template_km157w6', templateParams, 'QQpVRTj7aSUlz_3-2');
      })
      .then((customerResponse) => {
        console.log('2. Customer Confirmation Sent:', customerResponse);
        alert('Order sent successfully! A confirmation email has been sent to the client.');
        
        setFullName(''); 
        setEmail(''); 
        setCountry(''); 
        setCity(''); 
        setAddress(''); 
        setZipCode(''); 
        setNotes('');
        if (typeof setEmbroidery === 'function') setEmbroidery('Without Embroidery');
      })
      .catch((err) => {
        console.error('EmailJS Error Details:', err);
        alert('Error sending order. Please try again.');
      })
      .finally(() => {
        setIsSending(false);
      });
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
              onError={(e) => { e.target.src = 'https://placehold.co/400x400/151515/555555?text=Image+Coming+Soon'; }}
            />
          </div>

          <div className="config-controls">
            <h3>{selectedHelmet.name}</h3>
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

              {/* 1. Добавленная графа: Захисна пластина підборіддя (между visor и aventail) */}
              {(selectedHelmet.options.chinPlate || selectedHelmet.specs.chinPlate) && (
                <li>
                  <strong>Chin Protection Plate:</strong>
                  <div className="mini-buttons">
                    {selectedHelmet.options.chinPlate ? (
                      selectedHelmet.options.chinPlate.map((c, i) => (
                        <button key={i} className={optChin?.label === c.label ? 'selected' : ''} onClick={() => setOptChin(c)}>
                          {c.label}
                        </button>
                      ))
                    ) : (
                      <div className="spec-static-btn">{selectedHelmet.specs.chinPlate}</div>
                    )}
                  </div>
                </li>
              )}
              
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

                  {optAv?.label.includes('Fabric') && (
                    <div className="fabric-patterns-container">
                      
                      <div className="color-section-header">
                        <span className="pattern-section-title">Main Color:</span>
                        <span className="selected-color-name">{primaryColor.name}</span>
                      </div>
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
                      </div>

                      {fabricPattern !== 'Solid' && (
                        <>
                          <div className="color-section-header" style={{ marginTop: '8px' }}>
                            <span className="pattern-section-title">Secondary Color:</span>
                            <span className="selected-color-name">{secondaryColor.name}</span>
                          </div>
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
                          </div>
                        </>
                      )}

                      <span className="pattern-section-title" style={{ marginTop: '10px', display: 'block' }}>Fabric Pattern:</span>
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

                      <span className="pattern-section-title" style={{ marginTop: '12px', display: 'block' }}>
                        Embroidery: <span className="sub-hint-text">(Price & design discussed with master)</span>
                      </span>
                      <div className="mini-buttons font-sub-buttons" style={{ marginTop: '6px' }}>
                        <button 
                          className={embroidery === 'Without Embroidery' ? 'selected' : ''} 
                          onClick={() => setEmbroidery('Without Embroidery')}
                        >
                          Without Embroidery
                        </button>
                        <button 
                          className={embroidery === 'With Embroidery' ? 'selected' : ''} 
                          onClick={() => setEmbroidery('With Embroidery')}
                        >
                          With Embroidery
                        </button>
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

              {/* 2. Добавленная графа: Масса изделия (Weight) */}
              <li>
                <strong>Weight:</strong>
                <div className="mini-buttons">
                  <div className="spec-static-btn">{selectedHelmet.specs.weight}</div>
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
              {generateRange(14, 20, 0.5).map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="order-section">
          <h4 className="order-section-title">Shipping & Contact Details</h4>
          
          <div className="shipping-form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text"
                className="calc-input" 
                placeholder="John Doe" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email"
                className="calc-input" 
                placeholder="example@mail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Country</label>
              <input 
                type="text"
                className="calc-input" 
                placeholder="France" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>City</label>
              <input 
                type="text"
                className="calc-input" 
                placeholder="Paris" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>

            <div className="input-group " className="input-group full-width">
              <label>Full Address</label>
              <input 
                type="text"
                className="calc-input" 
                placeholder="Street, House number, Apartment" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Zip Code / Postal Code</label>
              <input 
                type="text"
                className="calc-input" 
                placeholder="75001" 
                value={zipCode} 
                onChange={(e) => setZipCode(e.target.value)} 
              />
            </div>

            <div className="input-group full-width">
              <label>Notes</label>
              <textarea 
                className="calc-input text-area-input" 
                rows="3"
                placeholder="" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
          </div>

          <div className="price-tag">Total: €{totalPrice}</div>
          <button 
            className="confirm-btn" 
            onClick={sendOrder} 
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Forge My Helmet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;