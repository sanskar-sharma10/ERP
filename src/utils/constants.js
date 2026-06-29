/**
 * Application-wide constants
 */

export const DEFAULT_BACKEND_URL = 'http://localhost:5000';

export const STORAGE_KEYS = {
  AUTH: 'college_auth',
  BACKEND_URL: 'erp_backend_url',
};

export const MAJORS = [
  'Computer Science',
  'Bio-Engineering',
  'Quantum Physics',
  'Business Administration',
  'Information Security',
];

// Maps college major → backend inventory category (and reverse)
export const MAJOR_TO_CATEGORY = {
  'Computer Science': 'Hardware',
  'Bio-Engineering': 'Software License',
  'Quantum Physics': 'Subscription',
  'Business Administration': 'Office Supplies',
  'Information Security': 'Networking',
};

export const CATEGORY_TO_MAJOR = Object.fromEntries(
  Object.entries(MAJOR_TO_CATEGORY).map(([k, v]) => [v, k])
);

export const FALLBACK_COURSES = [
  { id: 'cse101', name: 'CSE-101: Software Architecture & Data Systems', instructor: 'Dr. Sarah Connor', enrollment: 52 },
  { id: 'math202', name: 'MAT-202: Advanced Linear Algebra & Neural Models', instructor: 'Prof. Richard Feynman', enrollment: 24 },
  { id: 'phy303', name: 'PHY-303: Quantum Computing & Electromagnetism', instructor: 'Dr. Alan Turing', enrollment: 15 },
  { id: 'mgt404', name: 'MGT-404: Tech Product Development & Management', instructor: 'Prof. Samantha Vance', enrollment: 30 },
];

export const FALLBACK_STUDENTS = [
  { id: '1', name: 'Alexander Pierce', major: 'Computer Science', tuition: 4800.00, grade: 95 },
  { id: '2', name: 'Brooke Sterling', major: 'Bio-Engineering', tuition: 5200.00, grade: 88 },
  { id: '3', name: 'Charles Vance', major: 'Quantum Physics', tuition: 4500.00, grade: 92 },
  { id: '4', name: 'Danielle Miller', major: 'Business Administration', tuition: 3800.00, grade: 85 },
  { id: '5', name: 'Ethan Hunt', major: 'Information Security', tuition: 4800.00, grade: 97 },
];

export const FALLBACK_FACULTY = [
  { id: 'FAC-201', name: 'Dr. Sarah Connor', title: 'Professor of AI Engineering', dept: 'Computer Science', salary: 11500, load: '3 Classes' },
  { id: 'FAC-202', name: 'Prof. Richard Feynman', title: 'Dean of Sciences', dept: 'Applied Mathematics', salary: 14000, load: '2 Classes' },
  { id: 'FAC-203', name: 'Dr. Alan Turing', title: 'Lead Cybernetics Scholar', dept: 'Quantum Physics', salary: 12500, load: '4 Classes' },
  { id: 'FAC-204', name: 'Prof. Samantha Vance', title: 'Instructor of Enterprise Dev', dept: 'Business Operations', salary: 9800, load: '2 Classes' },
];
