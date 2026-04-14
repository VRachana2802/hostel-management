# 🏠 HostelOS — Smart Hostel Management System

A production-ready, full-featured Hostel Management System built with **React + Vite + TypeScript + Tailwind CSS**. Features a futuristic glassmorphism UI with role-based access control for Students, Wardens, and Admins.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm v9+

### Installation

```bash
# 1. Clone or extract the project
cd hostel-management

# 2. Install dependencies
npm install

# 3. Create environment file (optional — app runs with mock data without Supabase)
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials (optional)

# 4. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔐 Demo Login Credentials

Use the **Quick Demo Access** buttons on the login page, or enter manually:

| Role    | Email                | Password |
|---------|----------------------|----------|
| Student | student@hostel.com   | demo     |
| Warden  | warden@hostel.com    | demo     |
| Admin   | admin@hostel.com     | demo     |

---

## 🗄️ Supabase Setup (Optional)

The app runs fully on mock data out of the box. To connect a real Supabase backend:

### 1. Create `.env.local`
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Run these SQL migrations in Supabase SQL Editor

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('student', 'warden', 'admin')) NOT NULL,
  roll_number TEXT,
  phone TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  room_id UUID,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_no TEXT NOT NULL UNIQUE,
  floor INTEGER NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  occupants INTEGER NOT NULL DEFAULT 0,
  type TEXT CHECK (type IN ('single', 'double', 'triple')) NOT NULL,
  status TEXT CHECK (status IN ('available', 'full', 'maintenance')) DEFAULT 'available'
);

-- Outpass table
CREATE TABLE outpass (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  return_date DATE NOT NULL,
  return_time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  parent_verified BOOLEAN DEFAULT FALSE,
  warden_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'on-leave')) NOT NULL,
  check_in TIME,
  check_out TIME
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  type TEXT CHECK (type IN ('hostel_fee', 'mess_fee', 'maintenance', 'other')) NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue')) DEFAULT 'pending',
  due_date DATE NOT NULL,
  paid_date DATE,
  description TEXT
);

-- Complaints table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  warden_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Menu table
CREATE TABLE menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')) NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE
);

-- Entry logs table
CREATE TABLE entry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  type TEXT CHECK (type IN ('check_in', 'check_out')) NOT NULL,
  method TEXT CHECK (method IN ('qr', 'face', 'manual')) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  target_role TEXT DEFAULT 'all',
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE outpass ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### 3. Enable Supabase Auth
- Go to **Authentication → Settings** in Supabase dashboard
- Enable Email/Password provider
- Set Site URL to `http://localhost:5173`

---

## 📁 Project Structure

```
hostel-management/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── AttendanceChart.tsx    # Recharts area/line charts
│   │   │   └── PaymentChart.tsx       # Bar + Pie charts
│   │   ├── layout/
│   │   │   ├── Layout.tsx             # Main layout wrapper
│   │   │   └── Sidebar.tsx            # Collapsible sidebar nav
│   │   └── ui/
│   │       ├── Badge.tsx              # Status badge component
│   │       ├── Modal.tsx              # Reusable modal
│   │       └── StatCard.tsx           # Dashboard stat cards
│   ├── context/
│   │   ├── AuthContext.tsx            # Auth state + login/signup
│   │   └── DataContext.tsx            # Global data store
│   ├── lib/
│   │   ├── mockData.ts                # All mock data
│   │   ├── supabase.ts                # Supabase client
│   │   └── utils.ts                   # Helper functions
│   ├── pages/
│   │   ├── student/
│   │   │   ├── Dashboard.tsx          # Student home
│   │   │   ├── Outpass.tsx            # Apply & track outpass
│   │   │   ├── EntryExit.tsx          # QR-based entry/exit
│   │   │   ├── FaceRecognition.tsx    # Webcam face auth
│   │   │   ├── MenuBooking.tsx        # Daily meal booking
│   │   │   ├── Complaints.tsx         # Submit & track issues
│   │   │   ├── Payments.tsx           # Fee payment portal
│   │   │   └── Notifications.tsx      # Alerts & announcements
│   │   ├── warden/
│   │   │   ├── Dashboard.tsx          # Warden overview
│   │   │   ├── OutpassManagement.tsx  # Approve/reject with OTP
│   │   │   ├── EntryLogs.tsx          # Monitor check-in/out
│   │   │   ├── ComplaintsManagement.tsx # Resolve complaints
│   │   │   ├── Attendance.tsx         # Student attendance view
│   │   │   └── Announcements.tsx      # Post announcements
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx          # Admin overview + KPIs
│   │   │   ├── Students.tsx           # CRUD user management
│   │   │   ├── Rooms.tsx              # Room allocation
│   │   │   ├── Payments.tsx           # Fee management
│   │   │   ├── MenuManagement.tsx     # Edit weekly menu
│   │   │   └── Analytics.tsx          # Charts & AI insights
│   │   ├── Auth.tsx                   # Login / Signup page
│   │   └── NotFound.tsx               # 404 page
│   ├── types/
│   │   └── index.ts                   # All TypeScript types
│   ├── App.tsx                        # Routes & providers
│   ├── index.css                      # Global styles + Tailwind
│   └── main.tsx                       # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ✨ Features

### 👨‍🎓 Student Portal
- **Dashboard** — Room info, attendance %, AI alerts, announcements
- **Outpass** — Apply, track status (Pending/Approved/Rejected)
- **Entry/Exit** — QR code simulation with animated scanner
- **Face Recognition** — Webcam capture + AI verification simulation
- **Meal Booking** — Book/cancel breakfast, lunch, dinner per day
- **Complaints** — Submit with category/priority, track resolution
- **Fee Payment** — View dues, pay via card modal
- **Notifications** — Read/unread alerts with type indicators

### 👨‍🏫 Warden Portal
- **Dashboard** — Overview of pending items + attendance chart
- **Outpass** — Approve/reject with OTP parent verification simulation
- **Entry Logs** — Real-time check-in/check-out monitoring
- **Complaints** — Update status, add resolution notes
- **Attendance** — Per-student breakdown with AI risk prediction
- **Announcements** — Publish urgent/normal announcements

### 🛠️ Admin Portal
- **Dashboard** — KPI cards, multi-chart analytics
- **Students** — Full CRUD for users with room assignment
- **Rooms** — Visual room grid, status management, occupancy bars
- **Payments** — Add records, mark paid, filter by status
- **Menu** — Edit daily meal items per day inline
- **Analytics** — Radar chart, trend lines, AI recommendations

### 🤖 AI Features
- Smart attendance prediction with at-risk flags
- Fee reminder alerts based on payment patterns
- Face recognition confidence scoring
- Room optimization suggestions

---

## 🎨 Design System

- **Font**: Orbitron (headers) + Sora (body) + JetBrains Mono (code)
- **Theme**: Dark glassmorphism — `#070711` base with neon cyan/purple accents
- **Components**: Glass cards, neon borders, gradient buttons
- **Charts**: Recharts with custom dark-theme tooltips
- **Responsive**: Full mobile/tablet/desktop support with collapsible sidebar

---

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

The `dist/` folder contains the production-ready static site.

---

## 📦 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18 + Vite 5                  |
| Language     | TypeScript 5                        |
| Styling      | Tailwind CSS 3 + Custom CSS         |
| Routing      | React Router DOM v6                 |
| Charts       | Recharts 2                          |
| Icons        | Lucide React                        |
| Backend      | Supabase (Auth + PostgreSQL)        |
| Dates        | date-fns                            |
| Utilities    | clsx + tailwind-merge               |

---

## 📝 Notes

- The app runs **100% on mock data** without any backend configuration
- All state is managed in React Context — no Redux needed
- Email/OTP notifications are **simulated** via `console.log` (check browser DevTools)
- QR scanning is **simulated** with visual animation

---

