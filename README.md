# 🎓 StudentNexus — Collegiate LinkedIn-Themed MERN Application

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application designed with a modern **LinkedIn theme** for college students. Students sign in with their email, complete a detailed collegiate profile showcasing their technical skills and optional photo, and immediately access an interactive home feed to discover peers, like skillsets, and join nearby & upcoming hackathon sessions.

---

## 🌟 Key Features

### 1. 📧 Email Authentication & Seamless Onboarding
- **Email-First Sign In**: Enter your university or personal email.
- **Auto-Routing Onboarding**: If the user is new, they are automatically routed to the student onboarding form:
  - **Full Name**
  - **Phone Number**
  - **Campus / City Address**
  - **College / University Name** (with quick suggestions)
  - **Respective Skills** (interactive chip input + 18+ popular suggestions)
  - **Optional Photo Upload** (drag & drop or upload from device with instant preview, or select a preset avatar)
  - **Headline & Bio** (professional summary)
- Direct routing to the **Home Page** upon form submission.

### 2. 💼 LinkedIn-Themed Interactive Home Feed
- **Top Navigation Bar**: LinkedIn logo (`in`), live search bar (filters students, skills, colleges), navigation tabs, and user profile dropdown.
- **Left Column**:
  - Mini profile card showing avatar, name, college, profile impressions, and total likes received.
  - Interactive **Filter by Skill** panel (React, Python, Machine Learning, UI/UX, Node.js, etc.).
- **Center Column**:
  - "Share an update / Showcase a skill" quick bar.
  - Student skill cards displaying college, location, headline, bio, and highlighted skills.
  - **Interactive Like Button**: Animated thumbs-up / like with real-time like counters and celebratory confetti burst!
  - **Connect Modal**: 1-click access to student contact details (Phone, Email, College) with quick copy buttons.
- **Right Column (Nearby & Upcoming Hackathons)**:
  - Dedicated collegiate hackathon radar.
  - Filter tabs: **All**, **Nearby (In-Person)**, and **Virtual**.
  - Event details: Prize pool, countdown, dates, tracks, and organizer.
  - **Hackathon Modal**: Detailed agenda and 1-click registration with live participant counts.

### 3. ⚡ Zero-Config Dual-Mode Database
- **MongoDB + Mongoose**: Connects directly to MongoDB or MongoDB Atlas via `MONGODB_URI`.
- **Automatic Fallback Store**: If MongoDB is not installed locally or offline, the server automatically uses a built-in JSON/in-memory store. **Zero crash, zero config required to test immediately!**

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### 1. Clone or Open the Repository
```bash
cd "C:\Users\viswanadh\.gemini\antigravity\scratch\student-nexus"
```

### 2. Install Dependencies
```bash
# Installs root, server, and client dependencies
npm run install:all
```

### 3. Run the App in Development Mode
```bash
npm run dev
```
- Frontend: `http://localhost:3000` (with hot module replacement)
- Backend: `http://localhost:5000` (with live reload)

### 4. Run in Single-Server Production Mode
```bash
npm run build
npm start
```
Open **`http://localhost:5000`** in your browser. The Express server serves both the compiled React client and all REST API routes!

---

## 📁 Project Architecture

```
student-nexus/
├── package.json             # Root scripts (dev, build, start)
├── .env.example             # Template for environment variables
├── .gitignore               # Git ignore rules
├── server/                  # Backend Express API
│   ├── models/
│   │   ├── User.js          # Mongoose Student schema
│   │   └── Hackathon.js     # Mongoose Hackathon schema
│   ├── data/
│   │   ├── fallbackStore.js # JSON/In-memory fallback store
│   │   └── store.json       # Persisted local store
│   ├── server.js            # Express server & API routes
│   └── package.json
└── client/                  # Frontend React (Vite + Tailwind CSS)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # LinkedIn style top bar
    │   │   ├── ProfileSidebar.jsx   # Left profile card
    │   │   ├── StudentCard.jsx      # Student skill card with likes
    │   │   ├── HackathonSection.jsx # Right upcoming hackathon feed
    │   │   ├── HackathonModal.jsx   # Hackathon details & registration
    │   │   └── ConnectModal.jsx     # Student contact popup
    │   ├── context/
    │   │   └── AuthContext.jsx      # Session & Auth state
    │   ├── pages/
    │   │   ├── LoginPage.jsx        # Email login & demo switcher
    │   │   ├── OnboardingPage.jsx   # Student skills & profile form
    │   │   └── HomePage.jsx         # 3-column LinkedIn dashboard
    │   ├── services/
    │   │   └── api.js               # Backend API client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## ☁️ Easy Deployment Guide

This project is optimized for 1-click deployment on **Render**, **Railway**, or **Vercel**.

### Option A: Deploy on Render (Recommended - Free Web Service)
1. Push your repository to **GitHub**.
2. Go to [render.com](https://render.com) and click **New → Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
5. *(Optional)* In **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (or leave empty to use the built-in fallback store).
6. Click **Deploy Web Service**. Your app is live!

---

### Option B: Deploy on Railway
1. Push your repository to **GitHub**.
2. Go to [railway.app](https://railway.app) and create a **New Project → Deploy from GitHub repo**.
3. Railway will automatically detect Node.js.
4. Set the start command to `npm start`.
5. *(Optional)* Add a Railway MongoDB plugin and connect `MONGODB_URI`.

---

### Option C: Connect Free MongoDB Atlas
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Sandbox** cluster.
3. In **Database Access**, create a user (username + password).
4. In **Network Access**, allow access from anywhere (`0.0.0.0/0`).
5. Click **Connect → Drivers** and copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_nexus?retryWrites=true&w=majority
   ```
6. Paste it into your `server/.env` or deployment environment variables.

---

## 🧪 Testing Credentials & Demo Profiles
If you want to test immediately without typing an email, click the demo buttons on the login page:
- **Alex Rivera**: `alex.rivera@nyu.edu` (NYU - MERN Stack Developer)
- **Priya Sharma**: `priya.sharma@columbia.edu` (Columbia - AI & Data Science)
- Or enter any new email (e.g., `yourname@campus.edu`) to test the onboarding flow!
