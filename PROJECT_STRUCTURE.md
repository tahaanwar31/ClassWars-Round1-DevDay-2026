# ClassWars Project Structure

## Overview
This is a monorepo containing a unified frontend (game + admin) and a separate backend API.

## Directory Structure

```
ClassWars-Round1-DevDay-2026/
│
├── src/                           # Frontend Source Code
│   ├── components/               # React Components
│   │   ├── Round1.tsx           # Main game component
│   │   ├── MatrixBackground.tsx # Animated background
│   │   ├── TacticalBackground.tsx
│   │   └── admin/               # Admin-specific components
│   │       └── Layout.tsx       # Admin dashboard layout
│   │
│   ├── pages/                   # Page Components
│   │   └── admin/              # Admin Dashboard Pages
│   │       ├── Login.tsx       # Admin login page
│   │       ├── Dashboard.tsx   # Admin overview
│   │       ├── Questions.tsx   # Question management
│   │       ├── GameConfig.tsx  # Game configuration
│   │       └── Sessions.tsx    # Session monitoring
│   │
│   ├── api/                    # API Integration
│   │   └── axios.ts           # Axios instance with auth
│   │
│   ├── data/                   # Static Data
│   │   └── questions.ts       # Sample questions
│   │
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
│
├── backend/                    # Backend API (NestJS)
│   ├── src/
│   │   ├── admin/             # Admin module
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.module.ts
│   │   │
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-auth.guard.ts
│   │   │
│   │   ├── game/              # Game module
│   │   │   ├── game.controller.ts
│   │   │   ├── game.service.ts
│   │   │   └── game.module.ts
│   │   │
│   │   ├── questions/         # Questions module
│   │   │   ├── questions.controller.ts
│   │   │   ├── questions.service.ts
│   │   │   └── questions.module.ts
│   │   │
│   │   ├── schemas/           # MongoDB Schemas
│   │   │   ├── admin.schema.ts
│   │   │   ├── game-config.schema.ts
│   │   │   ├── game-session.schema.ts
│   │   │   └── question.schema.ts
│   │   │
│   │   ├── scripts/           # Utility Scripts
│   │   │   └── seed.ts       # Database seeding
│   │   │
│   │   ├── app.module.ts     # Root module
│   │   └── main.ts           # Backend entry point
│   │
│   ├── dist/                  # Compiled backend code
│   ├── .env                   # Environment variables
│   ├── .env.example          # Environment template
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript config
│
├── dist/                      # Frontend build output
├── node_modules/             # Frontend dependencies
│
├── index.html                # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── package.json             # Root package.json
│
├── README.md                # Main documentation
├── QUICKSTART.md           # Quick start guide
└── PROJECT_STRUCTURE.md    # This file
```

## Key Files

### Frontend Configuration
- `vite.config.ts` - Vite dev server and build config
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Dependencies and scripts
- `index.html` - HTML template

### Backend Configuration
- `backend/.env` - Environment variables (MongoDB, JWT, etc.)
- `backend/nest-cli.json` - NestJS CLI configuration
- `backend/tsconfig.json` - Backend TypeScript config
- `backend/package.json` - Backend dependencies

### Routing
- `src/App.tsx` - Main router configuration
  - `/` - Game interface
  - `/admin/login` - Admin login
  - `/admin/dashboard` - Admin dashboard
  - `/admin/questions` - Question management
  - `/admin/config` - Game configuration
  - `/admin/sessions` - Session monitoring

## Technology Stack

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Motion

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (Passport)
- **Validation**: class-validator

## Port Configuration

- **Frontend Dev Server**: 3000
- **Backend API**: 3002
- **Frontend Preview**: 4173 (after build)

## API Endpoints

### Authentication
- `POST /auth/login` - Admin login

### Admin
- `GET /admin/stats` - Dashboard statistics

### Questions
- `GET /questions` - List all questions
- `POST /questions` - Create question
- `PUT /questions/:id` - Update question
- `DELETE /questions/:id` - Delete question

### Game Config
- `GET /game/config` - Get game configuration
- `PUT /game/config` - Update game configuration

### Sessions
- `GET /game/sessions` - List game sessions
- `DELETE /game/sessions/:id` - Delete session

## Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Frontend: Edit files in `src/`
   - Backend: Edit files in `backend/src/`
   - Hot reload is enabled for both

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Deploy**
   - Frontend: Deploy `dist/` folder
   - Backend: Deploy `backend/dist/` folder

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=3002
ADMIN_EMAIL=admin@classwars.com
ADMIN_PASSWORD=admin123
```

## Scripts Reference

### Root Level
- `npm run dev` - Run both frontend and backend
- `npm run dev:frontend` - Frontend only
- `npm run dev:backend` - Backend only
- `npm run build` - Build both
- `npm run install:all` - Install all dependencies
- `npm run seed` - Seed database

### Frontend Only
- `npm run build:frontend` - Build frontend
- `npm run preview` - Preview production build
- `npm run lint` - Type check

### Backend Only
- `npm run build:backend` - Build backend
- `npm run seed` - Seed database
