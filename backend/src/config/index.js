'use strict';

require('dotenv').config();

const path = require('path');

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitList = (value) =>
  (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const env = process.env.NODE_ENV || 'development';

const config = Object.freeze({
  env,
  isProd: env === 'production',
  port: toInt(process.env.PORT, 5001),

  cors: {
    origins: splitList(process.env.CORS_ORIGINS),
    allowAll: (process.env.CORS_ORIGINS || '').trim() === '*',
  },

  admin: {
    token: process.env.ADMIN_TOKEN || '',
  },

  business: {
    printBidIncrement: toInt(process.env.PRINT_BID_INCREMENT, 125),
    defaultEditionSize: toInt(process.env.DEFAULT_EDITION_SIZE, 500),
    maxBodyMb: toInt(process.env.MAX_BODY_MB, 8),
  },

  firebase: {
    rawConfig: process.env.FIREBASE_CONFIG,
    serviceAccountPath: path.resolve(__dirname, '..', '..', 'serviceAccount.json'),
  },
});

if (!config.admin.token && config.isProd) {
  // Fail fast in production rather than booting an unprotected admin endpoint.
  throw new Error('ADMIN_TOKEN must be set in production environments.');
}

module.exports = config;
