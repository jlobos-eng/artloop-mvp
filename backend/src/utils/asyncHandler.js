'use strict';

/**
 * Wraps an async Express handler so any rejection is forwarded to next().
 * Avoids try/catch boilerplate in every route.
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
