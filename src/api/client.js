/**
 * Base API client
 * Wraps fetch with consistent error handling, timing, and JSON parsing.
 * All domain API modules should use this instead of raw fetch.
 */

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Core request helper
 * @param {string} url - Full URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<{ data: any, latencyMs: number }>}
 */
export async function request(url, options = {}) {
  const start = performance.now();

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const latencyMs = Math.round(performance.now() - start);

  if (!res.ok) {
    let errorData = null;
    try { errorData = await res.json(); } catch (_) { /* ignore */ }
    throw new ApiError(
      errorData?.message || `Request failed with status ${res.status}`,
      res.status,
      errorData
    );
  }

  const data = await res.json();
  return { data, latencyMs };
}

export const get = (url, options) => request(url, { method: 'GET', ...options });
export const post = (url, body, options) => request(url, { method: 'POST', body: JSON.stringify(body), ...options });
export const put = (url, body, options) => request(url, { method: 'PUT', body: JSON.stringify(body), ...options });
export const del = (url, options) => request(url, { method: 'DELETE', ...options });
