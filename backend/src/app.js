'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const { initFirebase } = require('./config/firebase');
const logger = require('./utils/logger');
const { notFoundHandler, errorHandler } = require('./middleware/error');

const dropsRouter = require('./routes/drops.routes');
const adminRouter = require('./routes/admin.routes');
const healthRouter = require('./routes/health.routes');

function buildCorsOptions() {
  if (config.cors.allowAll) {
    return { origin: true, credentials: false };
  }

  return {
    origin(origin, callback) {
      // Allow same-origin / curl / server-to-server (no Origin header).
      if (!origin) return callback(null, true);
      if (config.cors.origins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: false,
  };
}

function createApp() {
  // Initialize Firebase up front so any boot error fails before listening.
  initFirebase();

  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: `${config.business.maxBodyMb}mb` }));
  app.use(express.urlencoded({ extended: false, limit: `${config.business.maxBodyMb}mb` }));

  if (!config.isProd) {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan('combined', {
        stream: { write: (line) => logger.info(line.trim()) },
      }),
    );
  }

  // Public API rate limit (generous; admin router has its own stricter limit).
  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      max: 240,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many requests.' } },
    }),
  );

  app.use('/api/health', healthRouter);
  app.use('/api/drops', dropsRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
