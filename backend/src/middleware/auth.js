'use strict';

const crypto = require('crypto');
const config = require('../config');
const ApiError = require('../utils/ApiError');

/**
 * Constant-time comparison that does not leak information through length.
 */
function safeEqual(a, b) {
  const bufA = Buffer.from(a || '', 'utf8');
  const bufB = Buffer.from(b || '', 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAdmin(req, _res, next) {
  if (!config.admin.token) {
    return next(
      ApiError.internal('Admin authentication is not configured on the server.'),
    );
  }

  const provided = req.get('x-admin-token') || req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!provided || !safeEqual(provided, config.admin.token)) {
    return next(ApiError.unauthorized('Invalid or missing admin credentials.'));
  }

  return next();
}

module.exports = { requireAdmin };
