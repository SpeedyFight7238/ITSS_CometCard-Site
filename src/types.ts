export type ItemCategory =
  | 'Comet Cards'
  | 'Electronics'
  | 'Water Bottles & Tumblers'
  | 'Clothing & Accessories'
  | 'Notebooks & Books'
  | 'Keys & Accessories'
  | 'Other';

export type UTDLocation =
  | 'Eugene McDermott Library'
  | 'Student Union'
  | 'Naveen Jindal School of Management'
  | 'Activity Center'
  | 'Engineering and Computer Science buildings'
  | 'Founders Building'
  | 'Residence Halls'
  | 'Other Campus Location';

export type ItemStatus = 'Available' | 'Approved — Awaiting Return' | 'Returned';

export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected';

export interface FoundItem {
  id: string; // e.g. 'CF-101'
  category: ItemCategory;
  description: string;
  dateFound: string; // YYYY-MM-DD
  campusLocation: UTDLocation;
  specificLocation?: string; // Optional typed detail e.g. "near a study table"
  status: ItemStatus;
  dateReturned?: string;
  returnedToName?: string;
  createdAt: string;
}

export interface ClaimRequest {
  id: string; // e.g. 'CLM-201'
  itemId: string;
  claimantName: string; // Fictional name
  contactEmail: string; // Hidden until approved
  contactPhone: string; // Hidden until approved
  identifyingDetail: string; // Specific identifying details not shown on public board
  submittedAt: string; // ISO timestamp
  status: ClaimStatus;
  reviewDate?: string;
  rejectionReason?: string;
}

export type MainScreen = 'search' | 'post' | 'reviewer';
export type ReviewerTab = 'pending' | 'approved' | 'rejected' | 'all' | 'returned';
