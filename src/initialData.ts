import { FoundItem, ClaimRequest, ItemCategory, UTDLocation } from './types';

export const ITEM_CATEGORIES: ItemCategory[] = [
  'Comet Cards',
  'Electronics',
  'Water Bottles & Tumblers',
  'Clothing & Accessories',
  'Notebooks & Books',
  'Keys & Accessories',
  'Other',
];

export const CAMPUS_LOCATIONS: UTDLocation[] = [
  'Eugene McDermott Library',
  'Student Union',
  'Naveen Jindal School of Management',
  'Activity Center',
  'Engineering and Computer Science buildings',
  'Founders Building',
  'Residence Halls',
  'Other Campus Location',
];

// 5 Sample listings specified in the requirements
export const INITIAL_ITEMS: FoundItem[] = [
  {
    id: 'CF-101',
    category: 'Water Bottles & Tumblers',
    description: 'Black water bottle found near a library study table.',
    dateFound: '2026-10-21',
    campusLocation: 'Eugene McDermott Library',
    specificLocation: 'near a study table',
    status: 'Available',
    createdAt: '2026-10-21T10:15:00.000Z',
  },
  {
    id: 'CF-102',
    category: 'Clothing & Accessories',
    description: 'Blue umbrella found under a Student Union table.',
    dateFound: '2026-10-22',
    campusLocation: 'Student Union',
    specificLocation: 'under a dining table',
    status: 'Available',
    createdAt: '2026-10-22T11:30:00.000Z',
  },
  {
    id: 'CF-103',
    category: 'Other',
    description: 'Black backpack found near library seating.',
    dateFound: '2026-10-20',
    campusLocation: 'Eugene McDermott Library',
    specificLocation: 'second-floor seating area',
    status: 'Available',
    createdAt: '2026-10-20T14:45:00.000Z',
  },
  {
    id: 'CF-104',
    category: 'Notebooks & Books',
    description: 'Purple notebook found near a classroom in the Jindal School.',
    dateFound: '2026-10-21',
    campusLocation: 'Naveen Jindal School of Management',
    specificLocation: 'near a classroom hallway',
    status: 'Available',
    createdAt: '2026-10-21T16:20:00.000Z',
  },
  {
    id: 'CF-105',
    category: 'Keys & Accessories',
    description: 'Keyring found near the Activity Center.',
    dateFound: '2026-10-19',
    campusLocation: 'Activity Center',
    specificLocation: 'near the main entrance walkway',
    status: 'Available',
    createdAt: '2026-10-19T09:10:00.000Z',
  },
];

// Fictional sample claims using @example.com and (202) 555-01XX
export const INITIAL_CLAIMS: ClaimRequest[] = [
  {
    id: 'CLM-301',
    itemId: 'CF-101',
    claimantName: 'Samira Patel',
    contactEmail: 'samira.patel@example.com',
    contactPhone: '(202) 555-0182',
    identifyingDetail: '32oz vacuum-insulated bottle with a dent on the bottom rim and a faint scratch across the screw-on cap.',
    submittedAt: '2026-10-21T13:40:00.000Z',
    status: 'Pending',
  },
  {
    id: 'CLM-302',
    itemId: 'CF-104',
    claimantName: 'Marcus Chen',
    contactEmail: 'marcus.chen@example.com',
    contactPhone: '(202) 555-0144',
    identifyingDetail: 'College-ruled spiral notebook with MATH 2414 written on the inside front cover in blue gel pen.',
    submittedAt: '2026-10-22T08:15:00.000Z',
    status: 'Pending',
  },
];
