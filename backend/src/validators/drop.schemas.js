'use strict';

const { z } = require('zod');

// data: URLs must be base64-encoded PNG/JPEG/WebP. We allow https URLs as well
// (e.g. Unsplash links used during seeding).
const imageSchema = z
  .string()
  .min(1, 'Image is required')
  .refine(
    (value) =>
      /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value) ||
      /^https?:\/\/.+\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(value) ||
      /^https?:\/\/images\.unsplash\.com\//i.test(value),
    { message: 'Image must be a base64 data URL or a direct https image link.' },
  );

const trimmedString = (min, max) =>
  z.string().trim().min(min, 'Required').max(max, `Maximum ${max} characters`);

const positiveNumber = z.coerce.number().positive().finite();
const nonNegativeInt = z.coerce.number().int().nonnegative();

const createDropSchema = z.object({
  title: trimmedString(2, 80),
  artist: trimmedString(2, 80),
  image: imageSchema,

  // --- NUEVOS CAMPOS EN LA LISTA BLANCA ---
  dimensions: trimmedString(1, 100),
  technique: trimmedString(1, 100),
  year: z.coerce.string().trim().min(1, 'Required').max(20),
  style: z.string().trim().max(100).optional(),
  // ----------------------------------------

  originalBid: positiveNumber,
  printPrice: positiveNumber,
  totalPrints: nonNegativeInt.default(500),
  description: z.string().trim().max(1000).optional(),
});

const dropIdParam = z.object({
  id: z.string().min(1).max(64),
});

module.exports = { createDropSchema, dropIdParam };