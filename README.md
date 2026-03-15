# ClassWars - Round 1 DevDay 2026

Full-stack trivia game with admin dashboard.

## Project Structure

```
ClassWars-Round1-DevDay-2026/
├── frontend/          # React frontend (Game + Admin)
└── backend/           # NestJS backend API
```

## Quick Start

### 1. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed
npm run start:dev
```

Backend runs on: http://localhost:3002

## Access

- **Game**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
  - Email: `admin@classwars.com`
  - Password: `admin123`

## Features

### Frontend
- Game interface with trivia questions
- Admin dashboard with routing
- Question management
- Game configuration
- Session monitoring
- JWT authentication

### Backend
- RESTful API
- MongoDB integration
- JWT authentication
- CRUD operations
- Game session management

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- NestJS + TypeScript
- MongoDB (Mongoose)
- JWT (Passport)
- class-validator

## Documentation

- `frontend/README.md` - Frontend documentation
- `backend/README.md` - Backend documentation
