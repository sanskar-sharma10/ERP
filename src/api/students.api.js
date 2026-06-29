import { get, post, del } from './client.js';

/**
 * Students API
 * Maps to the backend /api/inventory resource (college domain mapping).
 */

export async function fetchStudents(baseUrl) {
  const { data } = await get(`${baseUrl}/api/inventory`);
  return data;
}

export async function createStudent(baseUrl, payload) {
  const { data } = await post(`${baseUrl}/api/inventory`, payload);
  return data;
}

export async function removeStudent(baseUrl, id) {
  const { data } = await del(`${baseUrl}/api/inventory/${id}`);
  return data;
}
