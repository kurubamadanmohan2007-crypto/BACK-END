# 📍 Local Resource Map - Community Resource Directory

A complete, modern, and responsive **MERN Stack** (MongoDB, Express.js, React.js, Node.js) web application designed to connect local residents with vital public facilities and utilities.

![Theme](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-2563eb?style=for-the-badge)
![Express](https://img.shields.io/badge/Backend-Express%20%26%20Node.js-10b981?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-059669?style=for-the-badge)

---

## 🎯 Problem Statement
Residents and visitors frequently struggle to locate essential neighborhood facilities — such as clean drinking water refill fountains, mobile device / EV charging points, emergency shelters, accessible public restrooms, walk-in clinics, and community spaces. **Local Resource Map** provides a single, verified, searchable directory with community-driven updates and automatic staleness warnings.

---

## ✨ Features Implemented

### 1. 🏡 Landing Page & Navigation
- Modern sticky navigation bar with emerald green, civic blue, and crisp white styling.
- Live directory stats counter banner (total resources, verified fresh, flagged outdated, accessible).
- Hero section with search bar and 1-click category filter chips.

### 2. 🗂️ Resource Directory (Card Grid & Area Map Views)
- Modern cards showcasing facility photos, name, category badge, address, hours, and access notes.
- Quick interactive map view displaying pinned resources across the district with popovers.

### 3. 🔍 Search & Multi-Criteria Filtering
- Real-time text search across names, descriptions, addresses, and accessibility notes.
- Category filters: *Drinking Water, Charging Point, Shelter, Public Toilet, Hospital / Clinic, Community Facility, Food Bank, Wi-Fi Zone*.
- Sort by: *Recently Added, Most Upvoted / Helpful, Recently Verified, Alphabetical*.
- Filter by freshness: *All, Verified Fresh (&le;30 Days), Flagged Outdated (&gt;30 Days)*.

### 4. 📋 Resource Details Modal
- Complete view including full address, hours, access notes, phone, email, and website.
- Direct navigation shortcut opening Google Maps with the facility location.
- Helpful upvote counter.

### 5. ➕ Add Resource Form
- Public submission modal with input validation for newly discovered community utilities.
- Instant feedback and automatic addition to the directory.

### 6. ⚠️ Report an Issue
- Community problem reporting for incorrect address, closed facility, changed hours, or damaged assets.
- Stored and tracked in the backend database.

### 7. 🛡️ Verification System (>30 Days Auto-Flagging)
- Every resource records `lastVerifiedAt` and `verificationCount`.
- **Auto-Flagging Rule**: If a resource hasn't been verified for **more than 30 days**, the system automatically flags it with an amber warning badge (`⚠️ Potentially Outdated`).
- **Community Verification**: Residents and volunteers can click **"Verify Active Now"** on any resource to refresh its verification timestamp and clear the outdated flag.

---

## 📁 Project Structure

```
BACK END 1/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection (with automatic fallback)
│   ├── controllers/
│   │   ├── resourceController.js # CRUD, search, filter, verification, upvotes, stats
│   │   └── reportController.js   # Issue reporting logic
│   ├── models/
│   │   ├── Resource.js           # Resource schema with >30 day virtuals
│   │   └── Report.js             # Issue reports schema
│   ├── routes/
│   │   ├── resourceRoutes.js     # /api/resources endpoints
│   │   └── reportRoutes.js       # /api/reports endpoints
│   ├── seed/
│   │   ├── sampleData.js         # 12 diverse sample resources (fresh & outdated)
│   │   └── seedData.js           # Database seeding script
│   ├── .env                      # Environment configuration
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsBanner.jsx
│   │   │   ├── SearchFilterBar.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── ResourceDetailModal.jsx
│   │   │   ├── AddResourceModal.jsx
│   │   │   ├── ReportIssueModal.jsx
│   │   │   ├── InteractiveMapPreview.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js            # Frontend REST API client
│   │   ├── App.jsx               # Main React Application
│   │   ├── index.css             # Design system (Green, Blue, White theme)
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Vite configuration with API proxy to port 5000
│   └── package.json              # Frontend dependencies
│
├── package.json                  # Root scripts (runs frontend & backend together)
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (Local MongoDB service or MongoDB Atlas URI, or zero-config in-memory mode)

---

### Installation

1. Open a terminal in the root folder (`BACK END 1`):
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

---

### Running the Application

You can start the full stack application with a single command from the root directory:

```bash
npm start
```

Or run backend and frontend independently in two separate terminal windows:

#### Terminal 1 (Backend):
```bash
cd backend
npm start
```
*The backend server will start on `http://localhost:5000`.*
*(If local MongoDB is not running, it automatically spins up an in-memory MongoDB instance and auto-seeds all sample resources!)*

#### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
*The React client will start on `http://localhost:3000`.*

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | Get all resources with search, category, status & outdated filters |
| `GET` | `/api/resources/:id` | Get single resource by ID |
| `POST` | `/api/resources` | Submit a new public community resource |
| `PUT` | `/api/resources/:id` | Update resource details |
| `DELETE` | `/api/resources/:id` | Delete resource |
| `POST` | `/api/resources/:id/verify` | Verify resource (refreshes verified date to today) |
| `POST` | `/api/resources/:id/upvote` | Upvote / mark facility as helpful |
| `GET` | `/api/resources/meta/stats` | Get dashboard counters and category breakdown |
| `POST` | `/api/reports` | Submit an issue report for a facility |
| `GET` | `/api/reports` | View all issue reports |

---

## 🧪 Testing the 30-Day Verification System
The included sample database comes with resources pre-dated to demonstrate both fresh and outdated states:
1. **Fresh facilities** (e.g., *Downtown Civic Solar Fast-Charge Hub*, *Central Park Drinking Station*) display a green `Verified active (X days ago)` badge.
2. **Outdated facilities** (e.g., *Metro Central Eco Public Restrooms*, *Riverside Promenade*, *St. Jude Warming Center*) were verified >30 days ago and display an amber `⚠️ Flagged: Not verified in X days (Needs review)` warning.
3. Click the **"Verify"** button on any outdated card or in the Details modal to immediately update its verification date to today and watch the badge turn green!
