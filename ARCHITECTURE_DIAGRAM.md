# ClassWars Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ClassWars Application                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────┐
│   Frontend (Port 3000)   │◄───────►│  Backend (Port 3002) │
│   React + Vite + Router  │  HTTP   │  NestJS + MongoDB    │
└──────────────────────────┘         └──────────────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│                   http://localhost:3000                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   React Router   │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌───────────────────┐
    │   Public Routes   │       │   Admin Routes    │
    │                   │       │   (Protected)     │
    └───────────────────┘       └───────────────────┘
                │                           │
                ▼                           ▼
        ┌──────────┐              ┌─────────────────┐
        │    /     │              │  /admin/login   │
        │  Game    │              │  /admin/dash... │
        │Interface │              │  /admin/quest...│
        └──────────┘              │  /admin/config  │
                                  │  /admin/sess... │
                                  └─────────────────┘
```

## Routing Flow

```
User Request
     │
     ▼
┌─────────────────────────────────────────┐
│         React Router (App.tsx)          │
└─────────────────────────────────────────┘
     │
     ├─► Route: /
     │   └─► Component: Round1
     │       └─► Game Interface
     │
     └─► Route: /admin/*
         │
         ├─► /admin/login
         │   └─► Component: Login
         │       └─► No auth required
         │
         └─► /admin/* (Protected)
             │
             ├─► Check localStorage for token
             │   │
             │   ├─► Token exists?
             │   │   └─► YES: Render admin pages
             │   │       │
             │   │       ├─► /admin/dashboard → Dashboard
             │   │       ├─► /admin/questions → Questions
             │   │       ├─► /admin/config → GameConfig
             │   │       └─► /admin/sessions → Sessions
             │   │
             │   └─► NO: Redirect to /admin/login
```

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Flow                        │
└──────────────────────────────────────────────────────────────┘

1. Login Request
   ┌──────────┐
   │  User    │
   └────┬─────┘
        │ Email + Password
        ▼
   ┌──────────────┐
   │ Login.tsx    │
   └──────┬───────┘
          │ POST /auth/login
          ▼
   ┌──────────────┐
   │ Backend API  │
   └──────┬───────┘
          │ JWT Token
          ▼
   ┌──────────────┐
   │localStorage  │ ← Store token
   └──────┬───────┘
          │
          ▼
   Redirect to /admin/dashboard

2. Authenticated Request
   ┌──────────────┐
   │ Admin Page   │
   └──────┬───────┘
          │ API Request
          ▼
   ┌──────────────┐
   │ axios.ts     │ ← Add token to header
   └──────┬───────┘
          │ Authorization: Bearer <token>
          ▼
   ┌──────────────┐
   │ Backend API  │
   └──────┬───────┘
          │ Response
          ▼
   ┌──────────────┐
   │ Admin Page   │
   └──────────────┘

3. Logout
   ┌──────────────┐
   │ Layout.tsx   │
   └──────┬───────┘
          │ Click Logout
          ▼
   ┌──────────────┐
   │localStorage  │ ← Remove token
   └──────┬───────┘
          │
          ▼
   Redirect to /admin/login
```

## API Communication

```
┌─────────────────────────────────────────────────────────────┐
│                    API Communication                         │
└─────────────────────────────────────────────────────────────┘

Frontend Component
     │
     ▼
┌──────────────┐
│  axios.ts    │ ← Configured with baseURL: http://localhost:3002
└──────┬───────┘
       │
       ├─► Interceptor: Add JWT token to headers
       │
       ▼
┌──────────────┐
│ Backend API  │
│ Port 3002    │
└──────┬───────┘
       │
       ├─► /auth/login        (POST)
       ├─► /admin/questions   (GET, POST, PUT, DELETE)
       ├─► /admin/config      (GET, PUT)
       ├─► /admin/sessions    (GET, DELETE)
       └─► /admin/stats       (GET)
       │
       ▼
┌──────────────┐
│  MongoDB     │
└──────────────┘
```

## File Structure Flow

```
src/
│
├── App.tsx ─────────────────► Main Router
│   │
│   ├─► Route: /
│   │   └─► components/Round1.tsx
│   │       ├─► components/MatrixBackground.tsx
│   │       └─► components/TacticalBackground.tsx
│   │
│   └─► Route: /admin/*
│       │
│       ├─► pages/admin/Login.tsx
│       │
│       └─► components/admin/Layout.tsx
│           │
│           ├─► pages/admin/Dashboard.tsx
│           ├─► pages/admin/Questions.tsx
│           ├─► pages/admin/GameConfig.tsx
│           └─► pages/admin/Sessions.tsx
│
└── api/axios.ts ────────────► API Client
    │
    └─► Interceptor: Add auth token
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Data Flow                             │
└─────────────────────────────────────────────────────────────┘

1. Game Data Flow
   ┌──────────┐
   │ Round1   │
   └────┬─────┘
        │ Uses static data
        ▼
   ┌──────────────┐
   │ questions.ts │
   └──────────────┘

2. Admin Data Flow
   ┌──────────────┐
   │ Admin Page   │
   └──────┬───────┘
          │ API Call
          ▼
   ┌──────────────┐
   │ axios.ts     │
   └──────┬───────┘
          │ HTTP Request
          ▼
   ┌──────────────┐
   │ Backend API  │
   └──────┬───────┘
          │ Database Query
          ▼
   ┌──────────────┐
   │  MongoDB     │
   └──────┬───────┘
          │ Data
          ▼
   ┌──────────────┐
   │ Backend API  │
   └──────┬───────┘
          │ JSON Response
          ▼
   ┌──────────────┐
   │ Admin Page   │
   └──────────────┘
```

## Component Hierarchy

```
App (Router)
│
├─► ErrorBoundary
│   │
│   ├─► Route: /
│   │   └─► Round1
│   │       ├─► MatrixBackground
│   │       └─► TacticalBackground
│   │
│   └─► Route: /admin/*
│       │
│       ├─► /admin/login
│       │   └─► Login
│       │
│       └─► /admin/* (Protected)
│           └─► ProtectedRoute
│               └─► Layout
│                   ├─► Navigation
│                   ├─► Logout Button
│                   └─► Children (Admin Pages)
│                       ├─► Dashboard
│                       ├─► Questions
│                       ├─► GameConfig
│                       └─► Sessions
```

## Port Configuration

```
┌─────────────────────────────────────────────────────────────┐
│                    Port Configuration                        │
└─────────────────────────────────────────────────────────────┘

Port 3000 (Frontend)
├─► Vite Dev Server
├─► Serves React Application
├─► Hot Module Replacement (HMR)
└─► Proxy /api → http://localhost:3002

Port 3002 (Backend)
├─► NestJS Application
├─► REST API Endpoints
├─► JWT Authentication
└─► MongoDB Connection
```

## Development vs Production

```
┌─────────────────────────────────────────────────────────────┐
│                  Development Mode                            │
└─────────────────────────────────────────────────────────────┘

npm run dev
    │
    ├─► Frontend: Vite Dev Server (Port 3000)
    │   ├─► Hot reload
    │   ├─► Source maps
    │   └─► Fast refresh
    │
    └─► Backend: NestJS Watch Mode (Port 3002)
        ├─► Auto restart on changes
        └─► TypeScript compilation

┌─────────────────────────────────────────────────────────────┐
│                  Production Build                            │
└─────────────────────────────────────────────────────────────┘

npm run build
    │
    ├─► Frontend: dist/
    │   ├─► Minified JS
    │   ├─► Optimized CSS
    │   └─► Static assets
    │
    └─► Backend: backend/dist/
        └─► Compiled JavaScript
```

## Summary

- **Single Frontend Application** with integrated admin dashboard
- **React Router** for client-side routing
- **Protected Routes** with JWT authentication
- **Axios Client** with interceptors for API calls
- **Clean Separation** between game and admin features
- **Unified Port** (3000) for all frontend routes
- **Backend API** on separate port (3002)
