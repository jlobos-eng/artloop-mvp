// Centralized API client. Handles base URL, JSON parsing, error normalization
// and a tiny in-memory cache so the home grid stays snappy on back navigation.

const DEFAULT_API =
  import.meta.env.VITE_API_BASE_URL || 'https://artloop-mvp.onrender.com';

export const API_BASE_URL = DEFAULT_API.replace(/\/$/, '');

const cache = new Map();

class ApiClientError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const url = `${API_BASE_URL}${path}`;

  const opts = {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    signal,
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(url, opts);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiClientError(0, 'NETWORK_ERROR', 'No se pudo contactar al servidor.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const err = payload?.error || {};
    throw new ApiClientError(
      response.status,
      err.code || 'HTTP_ERROR',
      err.message || `Error ${response.status}`,
      err.issues || err.details,
    );
  }
  return payload;
}

export const api = {
  async listDrops({ force = false } = {}) {
    if (!force && cache.has('drops')) return cache.get('drops');
    const data = await request('/api/drops');
    const safe = Array.isArray(data) ? data : [];
    cache.set('drops', safe);
    return safe;
  },

  async getDrop(id) {
    return request(`/api/drops/${encodeURIComponent(id)}`);
  },

  async buyPrint(id) {
    cache.delete('drops');
    return request(`/api/drops/${encodeURIComponent(id)}/buy-print`, { method: 'POST' });
  },

  async createDrop(payload, { adminToken }) {
    cache.delete('drops');
    return request('/api/admin/add-drop', {
      method: 'POST',
      body: payload,
      headers: adminToken ? { 'x-admin-token': adminToken } : {},
    });
  },

  invalidateCache() {
    cache.clear();
  },
};

export { ApiClientError };
