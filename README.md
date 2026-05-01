<div align="center">

# CLASS WARS

### A Competitive Coding & Strategy Platform

**Developed for Developers Day 2026 — ACM NUCES Chapter**
**FAST NUCES Karachi | April 30, 2026**

[![Live Demo](https://img.shields.io/badge/LIVE-CLASSWARS-00C853?style=for-the-badge&logo=heroku&logoColor=white)](https://classwars-45c006aaf281.herokuapp.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)

</div>

---

## At a Glance

Class Wars is a **two-round competitive programming and strategy platform** built for a live university coding competition. Teams compete across a multi-level MCQ trivia round and a unique **Tank Warfare** coding challenge where players write C++ AI code to control virtual tanks in real-time browser combat. The platform features a full admin dashboard, real-time leaderboards, time-based round access, and server-side C++ compilation — all designed and deployed within a tight competition timeline.

> **Live Deployment:** [classwars-45c006aaf281.herokuapp.com](https://classwars-45c006aaf281.herokuapp.com/)

---

## Key Features

### Competition Engine
- **Two-round format** — Round 1 (MCQ Trivia) + Round 2 (Tank Warfare Coding Challenge)
- **Time-based access control** — Countdown timers and configurable play windows restrict when each round goes live
- **Real-time combined leaderboard** — Merges scores from both rounds into unified team rankings
- **Team-based authentication** — Teams register and compete as units, not individuals

### Round 1: Multi-Level MCQ Trivia
- **10 progressive difficulty levels** with 50 questions each (500 total)
- **7 question types** — One-word answers, code output prediction, error detection, MCQ, code completion, system design, and more
- **Adaptive scoring** — Points scale with difficulty; streak bonuses reward consistency

### Round 2: Tank Warfare (The Signature Feature)
- Players write **real C++ code** (`class MyTank : public Tank`) with `move()`, `attack()`, and `defend()` method overrides
- Code is **compiled and executed server-side** via the Piston API, then parsed for behavioral profiling
- A **canvas-based game engine** renders tank combat in the browser using `requestAnimationFrame`
- **4 progressive levels:**
  - **Level 1** — Program movement to navigate checkpoints
  - **Level 2** — Add targeting logic to destroy moving enemies
  - **Level 3** — Implement shield defense to block incoming projectiles
  - **Level 4** — Full boss battle against MAKAROV (100 HP boss with shields and continuous fire)
- **Behavioral profiling system** — C++ test harness outputs `PROFILE:move:fire:shield` strategy lines that drive client-side tank AI
- **Smart scoring** — Base points + HP bonus + time bonus per level (max 200 pts/level, 800 total)

### Admin Dashboard
- **Real-time competition statistics** — Active sessions, completion rates, top performers, average scores
- **Question bank management** — Full CRUD across all levels and question types
- **Team management** — Create, monitor, and manage competing teams
- **Game configuration** — Enable/disable rounds, set play windows, define competition rules
- **Session monitoring** — Track live game sessions and player progress

### Developer Experience
- **CodeMirror C++ editor** — In-browser IDE with syntax highlighting, dark tactical theme, and smart indentation
- **Responsive UI** — Tailwind CSS + Framer Motion animations for a polished competition experience
- **Automated seeding** — Scripts to populate question banks, configure levels, and set up the competition

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | SPA with Vite bundler |
| **Styling** | Tailwind CSS 4 + Framer Motion | Utility-first CSS + animations |
| **Code Editor** | CodeMirror (via @uiw/react-codemirror) | In-browser C++ editor with syntax highlighting |
| **Backend** | NestJS + TypeScript | REST API with modular architecture |
| **Database** | MongoDB + Mongoose | Document storage for sessions, teams, questions |
| **Auth** | Passport.js + JWT | Team and admin authentication with protected routes |
| **Code Execution** | Piston API (`emkc.org`) | Server-side C++ compilation and sandboxed execution |
| **Hosting** | Heroku | Cloud deployment with MongoDB Atlas |

---

## Architecture

```
classwars/
├── backend/                    # NestJS API Server
│   └── src/
│       ├── auth/               # JWT authentication (Passport strategy)
│       ├── admin/              # Admin dashboard controllers & services
│       ├── teams/              # Team CRUD, login, leaderboard queries
│       ├── questions/          # Question bank management
│       ├── compile/            # C++ compilation via Piston API + profiling
│       ├── rounds/round1/      # MCQ session & scoring engine
│       ├── rounds/round2/      # Tank warfare session, scoring, test harness
│       ├── schemas/            # Mongoose schemas (team, session, config, question)
│       └── scripts/            # Database seeding & admin setup
├── frontend/                   # React SPA
│   └── src/
│       ├── pages/              # Login, Lobby, Admin (Dashboard, Leaderboard, etc.)
│       ├── rounds/round1/      # MCQ gameplay UI
│       ├── rounds/round2/      # Tank warfare game + C++ editor + canvas engine
│       ├── api/                # Axios instance with auth interceptors
│       └── components/         # Shared UI components
└── package.json                # Root build & deploy scripts
```

---

## How It Works — Tank Warfare (Round 2)

This is the standout feature of Class Wars. Here's the full pipeline:

```
Player writes C++ code
        │
        ▼
Code sent to backend ──► Wrapped in test harness ──► Compiled via Piston API
        │
        ▼
Test harness runs scenarios per level
        │
        ▼
Output: LEVEL1:S80:up ──► Parsed into behavioral profile
        LEVEL1:S20:down
        PROFILE:track:align:smart
        │
        ▼
Profile drives client-side tank AI
        │
        ▼
Canvas game loop renders combat via requestAnimationFrame
```

**Behavioral Profile Format:** `PROFILE:<move>:<fire>:<shield>`

| Action | Options | Effect |
|--------|---------|--------|
| Move | `track`, `up`, `down`, `idle` | Tank movement pattern |
| Fire | `align`, `always`, `none` | Firing trigger logic |
| Shield | `smart`, `none` | Auto-shield on incoming projectiles |

---

## Scoring System

### Round 2 — Tank Warfare (per level)

| Component | Max Points | Calculation |
|-----------|-----------|-------------|
| Base Score | 100 | Awarded on level completion |
| HP Bonus | 50 | `floor(hpRemaining / 100 * 50)` |
| Time Bonus | 50 | `max(0, 50 - floor(seconds / 10))` |
| **Total per level** | **200** | |
| **Round 2 Total** | **800** | 4 levels x 200 max |

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/tahaanwar31/ClassWars.git
cd ClassWars

# Install and build
npm run build

# Set up environment variables (backend)
cp backend/.env.example backend/.env
# Configure MongoDB URI and JWT secret in .env

# Seed the database
cd backend
npm run seed:all-levels
npm run create-admin

# Start development servers
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

---

## About

Built for **Developers Day 2026**, organized by the **ACM NUCES Student Chapter** at **FAST NUCES Karachi** on **April 30, 2026**. The platform was designed, developed, and deployed to host a live multi-team coding competition featuring 10 levels of trivia and a unique C++ tank warfare challenge.

---

<div align="center">

**[View Live Deployment](https://classwars-45c006aaf281.herokuapp.com/)**

</div>
