'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { requireAdmin } = require('../middleware/auth');
const { createDropSchema } = require('../validators/drop.schemas');
const dropService = require('../services/drop.service');

const router = express.Router();

// Stricter throttling on admin uploads to mitigate abuse.
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many admin requests.' } },
});

router.use(adminLimiter, requireAdmin);

router.post(
  '/add-drop',
  validate({ body: createDropSchema }),
  asyncHandler(async (req, res) => {
    const drop = await dropService.createDrop(req.body);
    res.status(201).json({ success: true, drop });
  }),
);

module.exports = router;
