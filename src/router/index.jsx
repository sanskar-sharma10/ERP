/**
 * Application route definitions.
 * Each route maps a path key to a page component and sidebar metadata.
 * Using a simple client-side router (no react-router dependency) — 
 * swap this for react-router-dom when the project grows to need deep linking.
 */

import Dashboard from '../pages/Dashboard.jsx';
import Students from '../pages/Students.jsx';
import Faculty from '../pages/Faculty.jsx';
import Fees from '../pages/Fees.jsx';
import Attendance from '../pages/Attendance.jsx';
import Finance from '../pages/Finance.jsx';
import HR from '../pages/HR.jsx';
import Inventory from '../pages/Inventory.jsx';
import Settings from '../pages/Settings.jsx';

export const ROUTES = [
  {
    id: 'dashboard',
    label: 'Control Dashboard',
    subtitle: 'Overview & metrics',
    component: Dashboard,
    icon: 'dashboard',
  },
  {
    id: 'faculty',
    label: 'Faculty Roster',
    subtitle: 'Professor registry',
    component: Faculty,
    icon: 'faculty',
  },
  {
    id: 'fees',
    label: 'Tuition & Fees',
    subtitle: 'Ledger billing',
    component: Fees,
    icon: 'fees',
  },
  {
    id: 'attendance',
    label: 'Class Attendance',
    subtitle: 'Roster roll calls',
    component: Attendance,
    icon: 'attendance',
  },
  {
    id: 'finance',
    label: 'Finance',
    subtitle: 'Accounts & budgets',
    component: Finance,
    icon: 'finance',
  },
  {
    id: 'hr',
    label: 'Human Resources',
    subtitle: 'Staff & payroll',
    component: HR,
    icon: 'hr',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    subtitle: 'Assets & stock',
    component: Inventory,
    icon: 'inventory',
  },
  {
    id: 'settings',
    label: 'Settings',
    subtitle: 'API & preferences',
    component: Settings,
    icon: 'settings',
  },
];

/**
 * Resolve a route component by id
 * @param {string} id
 * @returns {React.ComponentType}
 */
export function resolveRoute(id) {
  const route = ROUTES.find((r) => r.id === id);
  return route ? route.component : Dashboard;
}
