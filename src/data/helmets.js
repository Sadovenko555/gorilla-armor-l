// src/data/helmets.js
export const helmetsData = [
  {
    id: 'spoleto',
    name: 'Spoleto',
    basePrice: 670,
    specs: {
      dome: '2.5 mm hardened steel',
      visor: '2 mm hardened steel',
      aventail: 'Fabric + 1.2 mm hardened plates',
      liner: 'Soft liner included'
    },
    options: { rods: [], aventail: [] }
  },
 {
    id: 'wolf-ribs',
    name: 'Wolf Ribs',
    basePrice: 760,
    specs: {
      dome: '2.5 mm hardened steel',
      visor: 'Hardened steel ribs',
      aventail: 'Fabric + 1.2 mm hardened plates',
      liner: 'Soft liner included'
    },
    options: { 
      rods: [
        { label: 'Standard (6/10 mm)', priceMod: 0 },
        { label: 'Heavy Duty (8/12 mm)', priceMod: 35 }
      ],
      aventail: [] // ДОДАЙ ЦЕЙ РЯДОК, щоб код не "падав"
    }
  },
  {
    id: 'english-cross',
    name: 'English Cross',
    basePrice: 790,
    specs: {
      dome: '2.5 mm hardened steel',
      face: 'Hardened steel rods',
      aventail: 'Chain mail',
      liner: 'Soft liner included'
    },
    options: { 
      rods: [
        { label: '6 & 8 mm rods', priceMod: 0 },
        { label: '8 & 10 mm rods', priceMod: 25 }
      ],
      aventail: [
        { label: 'Standard Chain Mail', priceMod: 0 },
        { label: 'Stainless Chain Mail', priceMod: 50 }
      ]
    }
  },
  // Додай інші моделі (Nasal, Pigface, Romance) за такою ж логікою
];