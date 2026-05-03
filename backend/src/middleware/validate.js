'use strict';

/**
 * Tiny zod -> express adapter. Replaces the body/query/params with the parsed
 * (and coerced) data, throwing a ZodError that the global error handler turns
 * into a 400 response.
 */
function validate(schemas = {}) {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;
