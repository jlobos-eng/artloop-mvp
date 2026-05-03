'use strict';

const { admin, initFirebase } = require('../config/firebase');
const logger = require('../utils/logger');

const db = initFirebase();

const premiumDrops = [
  {
    title: 'Ecos del Vacío',
    artist: 'Elena Rostova',
    description:
      'Serie abstracta sobre la disolución del horizonte. Edición fine-art numerada, papel Hahnemühle 308gsm.',
    originalBid: 8500,
    printsSold: 412,
    totalPrints: 500,
    printPrice: 89,
    timeLeft: '04h 12m',
    status: 'hot',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1600',
  },
  {
    title: 'Génesis Fragmentado',
    artist: 'Marcus V.',
    description:
      'Obra figurativa contemporánea. Tinta pigmentada de archivo, 70 × 100 cm, certificado digital.',
    originalBid: 12400,
    printsSold: 495,
    totalPrints: 500,
    printPrice: 120,
    timeLeft: '01h 05m',
    status: 'hot',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1600',
  },
  {
    title: 'Distopía Neón',
    artist: 'Kael',
    description:
      'Pieza generativa inspirada en arquitecturas líquidas. Edición limitada, firmada y numerada.',
    originalBid: 3200,
    printsSold: 89,
    totalPrints: 250,
    printPrice: 59,
    timeLeft: '1d 14h',
    status: 'early',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600',
  },
];

async function seed() {
  logger.info('Seeding premium drops...');
  const now = admin.firestore.FieldValue.serverTimestamp();
  const endsAt = (hoursFromNow) =>
    admin.firestore.Timestamp.fromMillis(Date.now() + hoursFromNow * 3600 * 1000);

  const horizons = [4, 1, 38];
  let i = 0;
  for (const drop of premiumDrops) {
    await db.collection('drops').add({ ...drop, createdAt: now, endsAt: endsAt(horizons[i++] || 24) });
  }
  logger.info('Catalog seeded successfully.');
  process.exit(0);
}

seed().catch((err) => {
  logger.error('Seed failed', { message: err.message });
  process.exit(1);
});
