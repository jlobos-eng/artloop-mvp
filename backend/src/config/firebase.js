'use strict';

const admin = require('firebase-admin');
const config = require('./index');
const logger = require('../utils/logger');

let dbInstance = null;

function loadServiceAccount() {
  if (config.firebase.rawConfig) {
    const parsed = JSON.parse(config.firebase.rawConfig);
    if (typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(config.firebase.serviceAccountPath);
}

function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const serviceAccount = loadServiceAccount();
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  dbInstance = admin.firestore();
  dbInstance.settings({ ignoreUndefinedProperties: true });

  logger.info('Firebase Admin initialized');
  return dbInstance;
}

module.exports = { admin, initFirebase, get db() { return dbInstance || initFirebase(); } };
