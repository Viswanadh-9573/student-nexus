# 🚀 HackMate — LinkedIn-Themed Collegiate MERN Hackathon & Skill Network

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application designed with a modern **LinkedIn theme** for college students to match with teammates for hackathons. Students sign in with their email and password, select their engineering branch (CSE, ECE, MECH, EEE, CIVIL), highlight their real technical skills (Frontend, Backend, ML, etc.), send connection requests, and chat directly via an interactive direct messaging chatbox!

---

## 🌟 Key Features

### 1. 📧 Email & Password Authentication + Smart Onboarding
- **Credentials Sign In**: Enter your email address and password.
- **Auto-Routing Onboarding**: New users are prompted to complete their HackMate profile:
  - **Full Name**
  - **Account Password**
  - **Engineering Branch**: Dropdown with `CSE`, `ECE`, `MECH`, `EEE`, `CIVIL`
  - **Real Technical Skills**: Interactive tag input with domain tracks:
    - `Frontend`
    - `Backend`
    - `Full-Stack`
    - `Machine Learning (ML)`
    - `Artificial Intelligence (AI)`
    - `Data Science`
    - `DevOps & Cloud`
    - `Cybersecurity`
    - `UI/UX Design`
    - `Mobile App Development`
    - `IoT & Embedded Systems`
    - `Blockchain / Web3`
  - **College / University Name** (with 1-click suggestions)
  - **Campus Address**
  - **Optional Photo Upload** (device upload with preview or preset avatars)
  - **Headline & Bio** (hackathon goals & focus)

### 2. 💬 Direct Chatbox & Connection Requests
- **Interactive Chatbox**: Replaces phone numbers with a direct messaging modal.
  - Chat in real-time with any peer.
  - Message history persisted in backend store.
  - Quick conversation starters for hackathon teaming.
- **Connection Requests**:
  - Send 1-click connection requests to any peer (`Connect` → `Pending` → `Connected`).
  - Track mutual connections on profile cards.

### 3. 💼 LinkedIn-Themed Home Feed & Hackathon Radar
- **Top Navigation Bar**: HackMate branding, live search bar, and profile dropdown.
- **Branch & Skill Filters**:
  - Filter peers by branch (`CSE`, `ECE`, `MECH`, `EEE`, `CIVIL`).
  - Filter peers by real skills (`Frontend`, `Backend`, `ML`, etc.).
- **Interactive Likes**: Like student profiles with confetti celebration and live counts.
- **Nearby & Upcoming Hackathons**:
  - Filter by `Nearby`, `Virtual`, or `All`.
  - Details modal with tracks, prizes, dates, and 1-click registration.

### 4. ⚡ Zero-Config Dual-Mode Database
- **MongoDB + Mongoose**: Connects to MongoDB Atlas or local MongoDB via `MONGODB_URI`.
- **Automatic Fallback Store**: Falls back to built-in JSON storage if offline.

---

## 🚀 Quick Start (Local Development)

### 1. Run via PowerShell / Terminal
```powershell
# Open project directory
cd "C:\Users\viswanadh\Desktop\student-nexus"

# Start the application
npm start
```
Open **`http://localhost:5000`** in your browser.

### 2. Or 1-Click Launch
Double-click **`start.bat`** inside the project folder!
