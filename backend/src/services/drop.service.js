'use strict';

const { admin, db } = require('../config/firebase');
const config = require('../config');
const ApiError = require('../utils/ApiError');

const COLLECTION = 'drops';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/** Convert a Firestore document into a plain JSON-friendly object. */
function serialize(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    title: data.title || '',
    artist: data.artist || '',
    image: data.image || '',
    description: data.description || '',

    // --- NUEVOS CAMPOS ---
    dimensions: data.dimensions || '',
    style: data.style || '',
    technique: data.technique || '',
    year: data.year || '',
    // ---------------------

    originalBid: Number(data.originalBid) || 0,
    printPrice: Number(data.printPrice) || 0,
    printsSold: Number(data.printsSold) || 0,
    totalPrints: Number(data.totalPrints) || config.business.defaultEditionSize,
    status: data.status || 'early',
    timeLeft: data.timeLeft || '24h 00m',
    endsAt: data.endsAt ? data.endsAt.toMillis() : null,
    createdAt: data.createdAt ? data.createdAt.toMillis() : null,
  };
}

async function listDrops() {
  const snapshot = await db
    .collection(COLLECTION)
    .orderBy('createdAt', 'desc')
    .get()
    .catch(async () => db.collection(COLLECTION).get()); // fallback if index missing

  return snapshot.docs.map(serialize);
}

async function getDrop(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) throw ApiError.notFound('Drop not found');
  return serialize(doc);
}

async function createDrop(payload) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const endsAt = admin.firestore.Timestamp.fromMillis(Date.now() + TWENTY_FOUR_HOURS_MS);

  const newDrop = {
    title: payload.title,
    artist: payload.artist,
    image: payload.image,
    description: payload.description || '',

    // --- NUEVOS CAMPOS ---
    dimensions: payload.dimensions,
    technique: payload.technique,
    year: payload.year,
    style: payload.style || '',
    // ---------------------

    originalBid: Number(payload.originalBid),
    printPrice: Number(payload.printPrice),
    totalPrints: Number(payload.totalPrints) || config.business.defaultEditionSize,
    printsSold: 0,
    status: 'early',
    timeLeft: '24h 00m',
    createdAt: now,
    endsAt,
  };

  const ref = await db.collection(COLLECTION).add(newDrop);
  const created = await ref.get();
  return serialize(created);
}

/**
 * Atomically increment the prints-sold counter and recompute the implied
 * original bid. Uses a Firestore transaction so concurrent buys cannot race.
 */
async function buyPrint(id) {
  const ref = db.collection(COLLECTION).doc(id);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw ApiError.notFound('Drop not found');

    const data = snap.data();
    const totalPrints = Number(data.totalPrints) || config.business.defaultEditionSize;
    const printsSold = Number(data.printsSold) || 0;

    if (printsSold >= totalPrints) {
      throw ApiError.conflict('Edition sold out');
    }

    const updated = {
      printsSold: printsSold + 1,
      originalBid: (Number(data.originalBid) || 0) + config.business.printBidIncrement,
      status: printsSold + 1 >= totalPrints ? 'soldout' : data.status || 'live',
    };

    tx.update(ref, updated);
    return serialize({ id: snap.id, data: () => ({ ...data, ...updated }) });
  });
}

module.exports = { listDrops, getDrop, createDrop, buyPrint };