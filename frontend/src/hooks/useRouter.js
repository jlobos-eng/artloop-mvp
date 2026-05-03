// Lightweight hash-based router. Avoids adding a routing library while still
// giving us shareable URLs (e.g. #/drop/abc123) and back-button support.
import { useCallback, useEffect, useMemo, useState } from 'react';

const ROUTES = [
  { name: 'home',    pattern: /^\/?$/ },
  { name: 'admin',   pattern: /^\/admin\/?$/ },
  { name: 'drop',    pattern: /^\/drop\/([^/]+)\/?$/, keys: ['id'] },
  { name: 'artist',  pattern: /^\/artist\/([^/]+)\/?$/, keys: ['slug'] },
];

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  for (const route of ROUTES) {
    const match = path.match(route.pattern);
    if (match) {
      const params = {};
      (route.keys || []).forEach((key, idx) => {
        params[key] = decodeURIComponent(match[idx + 1] || '');
      });
      return { path, route: route.name, params };
    }
  }
  return { path, route: 'home', params: {} };
}

export function useRouter() {
  const [location, setLocation] = useState(parseHash);

  useEffect(() => {
    const onChange = () => {
      setLocation(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onChange);
    if (!window.location.hash) window.location.hash = '/';
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to) => {
    const target = to.startsWith('/') ? to : `/${to}`;
    if (window.location.hash === `#${target}`) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = target;
  }, []);

  return useMemo(() => ({ ...location, navigate }), [location, navigate]);
}
