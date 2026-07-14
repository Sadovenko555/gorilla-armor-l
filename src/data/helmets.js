export const helmetsData = [
  {
    id: 'spoleto',
    name: 'Spoleto',
    image: '/images/6.webp',
    basePrice: 670,
    specs: { dome: '2.5 mm hardened steel', visor: '2 mm hardened steel', weight: '7 kg ± 0.3 kg' },
    options: {
      chinPlate: [
  { label: 'Without Chin Plate', priceMod: 0 }, 
  { label: 'With Chin Plate 2 mm', priceMod: 5 }
],
      aventail: [{ label: 'Fabric (Standard)', priceMod: 0 }, { label: 'Chain Mail', priceMod: 180 }],
      plates: [{ label: 'Steel 1.2 mm (Standard)', priceMod: 0 }, { label: 'Titanium 0.8 mm', priceMod: 58 }],
      decoration: [{ label: 'Classic Grinding', priceMod: 0 }, { label: 'Blackening', priceMod: 20 }, { label: 'Gilding', priceMod: 30 }]
    }
  },
  {
    id: 'pigface',
    name: 'Klappviser (Pigface)',
    image: '/images/pigface.png',
    basePrice: 720,
    specs: { dome: '2.5 mm hardened steel', visor: '2 mm hardened steel', chinPlate: 'Included by default 2 mm', weight: '7 kg ± 0.3 kg' },
    options: {
      aventail: [{ label: 'Fabric (Standard)', priceMod: 0 }, { label: 'Chain Mail', priceMod: 180 }],
      plates: [{ label: 'Steel 1.2 mm (Standard)', priceMod: 0 }, { label: 'Titanium 0.8 mm', priceMod: 58 }],
      decoration: [{ label: 'Classic Grinding', priceMod: 0 }, { label: 'Blackening', priceMod: 20 }, { label: 'Gilding', priceMod: 30 }]
    }
  },
  {
    id: 'romance-alexander',
    name: 'Romance Of Alexander',
    image: '/images/romance-alexander.png',
    basePrice: 720,
    specs: { dome: '2.5 mm hardened steel', visor: '2 mm hardened steel + 1 mm Cross', weight: '7 kg ± 0.3 kg' },
    options: {
      chinPlate: [
  { label: 'Without Chin Plate', priceMod: 0 }, 
  { label: 'With Chin Plate 2 mm (+5€)', priceMod: 5 }
],
      aventail: [{ label: 'Fabric (Standard)', priceMod: 0 }, { label: 'Chain Mail', priceMod: 180 }],
      plates: [{ label: 'Steel 1.2 mm (Standard)', priceMod: 0 }, { label: 'Titanium 0.8 mm', priceMod: 58 }],
      decoration: [{ label: 'Classic Cross', priceMod: 0 }, { label: 'Blackening', priceMod: 15 }, { label: 'Gilding', priceMod: 25 }]
    }
  },
  {
    id: 'wolf-ribs',
    name: 'Wolf Ribs',
    image: '/images/10.webp',
    basePrice: 760,
    specs: { dome: '2.5 mm hardened steel', visor: 'Ribs 10 mm and 6 mm', chinPlate: 'Included by default 2 mm', weight: '7 kg ± 0.3 kg' },
    options: {
      aventail: [{ label: 'Fabric (Standard)', priceMod: 0 }, { label: 'Chain Mail', priceMod: 180 }],
      plates: [{ label: 'Steel 1.2 mm (Standard)', priceMod: 0 }, { label: 'Titanium 0.8 mm', priceMod: 58 }],
      decoration: [{ label: 'Classic Ribs', priceMod: 0 }, { label: 'Blackening', priceMod: 25 }, { label: 'Gilding', priceMod: 35 }]
    }
  },
  {
    id: 'english-cross',
    name: 'English Cross',
    image: '/images/1.webp',
    basePrice: 790,
    specs: { dome: '2.5 mm hardened steel', face: 'Steel rods 6 and 8 mm', aventail: 'Chain mail (Standard)', weight: '7 kg ± 0.3 kg' },
    options: {
      aventail: [],
      plates: [{ label: 'No plates', priceMod: 0 }, { label: 'Steel 1.2 mm', priceMod: 45 }, { label: 'Titanium 0.8 mm', priceMod: 58 }],
      decoration: [{ label: 'Classic Cross', priceMod: 0 }, { label: 'Blackening', priceMod: 15 }, { label: 'Gilding', priceMod: 25 }]
    }
  },
  {
    id: 'nasal',
    name: 'Nasal',
    image: '/images/nasal.png',
    basePrice: 800,
    specs: { dome: '2.5 mm hardened steel', face: 'Rods 6/8 mm + 2 mm nose guard', aventail: 'Chain mail (Standard)', weight: '7 kg ± 0.3 kg' },
    options: {
      aventail: [],
      plates: [{ label: 'No plates', priceMod: 0 }, { label: 'Steel 1.2 mm', priceMod: 45 }, { label: 'Titanium 0.8 mm', priceMod: 58 }],
      decoration: [{ label: 'Classic Nose', priceMod: 0 }, { label: 'Blackening', priceMod: 10 }, { label: 'Gilding', priceMod: 20 }]
    }
  }
];