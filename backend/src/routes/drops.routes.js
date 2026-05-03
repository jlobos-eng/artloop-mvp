'use strict';

const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { dropIdParam } = require('../validators/drop.schemas');
const dropService = require('../services/drop.service');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const drops = await dropService.listDrops();
    res.json(drops);
  }),
);

router.get(
  '/:id',
  validate({ params: dropIdParam }),
  asyncHandler(async (req, res) => {
    const drop = await dropService.getDrop(req.params.id);
    res.json(drop);
  }),
);

router.post(
  '/:id/buy-print',
  validate({ params: dropIdParam }),
  asyncHandler(async (req, res) => {
    const drop = await dropService.buyPrint(req.params.id);
    res.json({ success: true, drop });
  }),
);

module.exports = router;
