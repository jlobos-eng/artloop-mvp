'use strict';

/**
 * Lightweight structured logger. Avoids extra dependencies while still
 * producing JSON in production and human-friendly output in development.
 */

const LEVELS = ['debug', 'info', 'warn', 'error'];
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

function emit(level, message, meta) {
  const payload = {
    level,
    time: new Date().toISOString(),
    msg: message,
    ...(meta && typeof meta === 'object' ? meta : {}),
  };

  if (isProd) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
    return;
  }

  const colors = { debug: '\x1b[90m', info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' };
  const reset = '\x1b[0m';
  const tag = `${colors[level] || ''}[${level.toUpperCase()}]${reset}`;
  // eslint-disable-next-line no-console
  console.log(`${tag} ${message}${meta ? ` ${JSON.stringify(meta)}` : ''}`);
}

const logger = LEVELS.reduce((acc, level) => {
  acc[level] = (message, meta) => emit(level, message, meta);
  return acc;
}, {});

module.exports = logger;
