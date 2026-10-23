========================================================================
COMET FINDER — UT DALLAS LOST & FOUND PROTOTYPE
========================================================================

1. PURPOSE & OVERVIEW
---------------------
Comet Finder is a fictional student project designed for students and staff 
at The University of Texas at Dallas (UT Dallas). It provides a lightweight 
campus lost-and-found workflow to report found belongings, search directory 
listings, submit ownership claims with verifying details, review claims, 
and confirm physical handoffs.

Notice: Student Project Prototype — Not an Official UT Dallas Service.


2. SYSTEM REQUIREMENTS & RUN INSTRUCTIONS
-----------------------------------------
- Required Node.js Version: Node.js 18.x or higher (recommended Node.js 20.x+)
- Package Manager: npm (v9+) or pnpm / yarn

To run locally:
1. Clone or extract the project directory.
2. Install dependencies:
     npm install
3. Start the local development server:
     npm run dev
4. Open your browser and navigate to:
     http://localhost:3000

To build for production:
     npm run build


3. BACKEND & API KEYS
---------------------
No backend server, external database, or third-party API key is required. 
All matching, filtering, claiming, and approval operations run entirely in 
the client application without any remote API dependencies.


4. FIREBASE CLOUD FIRESTORE & PERSISTENCE
-----------------------------------------
All found items, claims, review statuses, and handoff confirmations are 
persisted in real-time to Google Cloud Firestore (Firebase Project: 
gen-lang-client-0882456909):
  - Firestore collection: items
  - Firestore collection: claims

Offline Fallback & Local Cache:
In addition, the app maintains an offline-safe cache in the browser's 
HTML5 LocalStorage API:
  - Items key:  campus_lost_and_found_items_v1
  - Claims key: campus_lost_and_found_claims_v1

Notice:
"Local Browser Storage & Firebase Cloud: Changes synchronize with Firebase 
Firestore and remain preserved across browser sessions and devices."

Refreshing the browser or reopening the tab preserves all records, pending 
counts, approvals, and returned statuses. A "Reset Sample Data" button with 
confirmation is provided to restore the 5 original fictional sample listings.


5. PROTOTYPE & PRIVACY LIMITS
-----------------------------
"This app demonstrates a lost-and-found process without real accounts. 
The reviewer screen is not restricted to a verified finder. Claim details 
and contact information are stored locally; hiding them in the interface 
is not secure access control. Use fictional information only."

- No real student IDs, NetIDs, or university passwords are used or requested.
- Does not verify UT Dallas enrollment or connect to official university 
  administrative systems.
- For lost or found Comet Cards, follow the official UT Dallas Comet Card 
  process (https://cometcard.utdallas.edu/). Do not post cardholder names, 
  student ID numbers, or photographs.


6. ARCHITECTURE & SCREENS
-------------------------
- Screen 1 (Search & Claim): Public searchable directory with category 
  filters, date sorting, and "This Is Mine / Claim" action. Returned items 
  are excluded; approved items are locked from additional claims.
- Screen 2 (Post Found Item): Form with category, general description, 
  date found, campus locations (Library, SU, JSOM, Activity Center, ECS, 
  Founders, Residence Halls, Other), optional typed detail, and automated PII check.
- Screen 3 (Submit Ownership Claim): Modal requiring Full Name, Contact Email, 
  Contact Phone, and Specific Identifying Details with field validation.
- Screen 4 (Finder / Reviewer Desk): 4-tab reviewer interface (Pending Claims, 
  Approved — Awaiting Return, All Open Items, Returned & Resolved) supporting 
  individual claim approval (contact reveal), revocation, rejection, and 
  confirmed physical handoff.
========================================================================
