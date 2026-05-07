'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { requireAdmin } = require('../middleware/auth');
const { createDropSchema, dropIdParam } = require('../validators/drop.schemas');
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

// RUTA 1: CREAR OBRA
router.post(
  '/add-drop',
  validate({ body: createDropSchema }),
  asyncHandler(async (req, res) => {
    const drop = await dropService.createDrop(req.body);
    res.status(201).json({ success: true, drop });
  }),
);

// RUTA 2: ELIMINAR OBRA (NUEVA)
router.delete(
  '/drops/:id',
  validate({ params: dropIdParam }),
  asyncHandler(async (req, res) => {
    await dropService.deleteDrop(req.params.id);
    res.status(200).json({ success: true, message: 'Obra eliminada del directorio' });
  }),
);

module.exports = router;