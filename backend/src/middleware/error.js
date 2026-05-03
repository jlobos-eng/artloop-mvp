'use strict';

const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} does not exist`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload failed validation.',
        issues: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }

  // Body-parser size errors
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'Image or payload exceeds the size limit.' },
    });
  }

  // CORS allowlist rejections — emit warning instead of error log spam.
  if (typeof err.message === 'string' && err.message.startsWith('Origin ') && err.message.includes('not allowed by CORS')) {
    logger.warn('Blocked by CORS allowlist', { origin: req.get('origin') });
    return res.status(403).json({ error: { code: 'CORS_FORBIDDEN', message: 'Origin not allowed.' } });
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error.' },
  });
}

module.exports = { notFoundHandler, errorHandler };
