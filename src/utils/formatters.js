/**
 * Shared formatting utilities
 */

/**
 * Format a number as USD currency
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a Date object to a readable local time string
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString();
}

/**
 * Format uptime seconds into a human-readable string
 * @param {number} seconds
 * @returns {string}
 */
export function formatUptime(seconds) {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

/**
 * Get initials from a full name string
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Map backend inventory item to a student domain object
 * @param {Object} item
 * @returns {Object}
 */
import { CATEGORY_TO_MAJOR } from './constants.js';

export function mapInventoryToStudent(item) {
  const cleanId = item.id.replace('_local', '');
  const major = CATEGORY_TO_MAJOR[item.category] || item.category;
  return {
    id: cleanId,
    name: item.name,
    major,
    tuition: item.price || 4000.0,
    grade: item.stock || 80,
  };
}
