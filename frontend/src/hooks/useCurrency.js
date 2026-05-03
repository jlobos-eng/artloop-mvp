import { useCallback, useEffect, useState } from 'react';
import { SUPPORTED_CURRENCIES } from '../utils/format';

const STORAGE_KEY = 'artloop:currency';

export function useCurrency() {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_CURRENCIES.includes(stored)) return stored;
    } catch {
      /* ignore */
    }
    return 'USD';
  });

  const setCurrency = useCallback((next) => {
    if (!SUPPORTED_CURRENCIES.includes(next)) return;
    setCurrencyState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.currency = currency;
  }, [currency]);

  return { currency, setCurrency, currencies: SUPPORTED_CURRENCIES };
}
