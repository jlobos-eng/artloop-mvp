// Locale + currency helpers. Centralized so every component speaks one tongue.

const RATES = { USD: 1, CLP: 950, EUR: 0.92 };
const SYMBOLS = { USD: '$', CLP: '$', EUR: '€' };
const LOCALES = { USD: 'en-US', CLP: 'es-CL', EUR: 'es-ES' };

export const SUPPORTED_CURRENCIES = Object.keys(RATES);

export function formatPrice(usd, currency = 'USD') {
  if (usd === null || usd === undefined || Number.isNaN(Number(usd))) return '—';
  const amount = Number(usd) * (RATES[currency] || 1);
  const formatted = new Intl.NumberFormat(LOCALES[currency] || 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${SYMBOLS[currency] || '$'}${formatted}`;
}

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function initials(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function formatRemaining(ms) {
  if (ms <= 0) return 'Cerrado';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours.toString().padStart(2, '0')}h`;
  if (hours > 0) return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}
