import { get } from './client.js';

/**
 * Health & server status API
 */

export async function checkHealth(baseUrl) {
  const { data, latencyMs } = await get(`${baseUrl}/api/health`);
  return { ...data, latencyMs };
}

export async function getStatus(baseUrl) {
  const { data } = await get(`${baseUrl}/api/status`);
  return data;
}
