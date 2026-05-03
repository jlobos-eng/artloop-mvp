import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

export function useDrops() {
  const [drops, setDrops] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);

  const load = useCallback(async ({ force = false } = {}) => {
    setStatus((prev) => (prev === 'ready' && !force ? prev : 'loading'));
    setError(null);
    try {
      const data = await api.listDrops({ force });
      setDrops(data);
      setStatus('ready');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replaceDrop = useCallback((updated) => {
    setDrops((prev) => prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)));
  }, []);

  return { drops, status, error, reload: load, replaceDrop };
}
