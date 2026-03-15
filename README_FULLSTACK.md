# ClassWars - Full Stack Application

Complete full-stack quiz game with NestJS backend, MongoDB, and React admin dashboard.

## Project Structure

```
ClassWars-Round1-DevDay-2026/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   ├── data/
│   └── ...
├── backend/                      # Backend (NestJS + MongoDB)
│   ├── src/
│   │   ├── auth/                # Authentication module
│   │   ├── questions/           # Questions API
│   │   ├── game/                # Game session management
│   │   ├── admin/               # Admin CRUD operations
│   │   ├── schemas/             # MongoDB schemas
│   │   └── scripts/             # Database seeding
│   └── ...
└── admin-dashboard/              # Admin Dashboard (React)
    ├── src/
    │   ├── pages/               # Dashboard pages
    │   ├── components/          # Reusable components
    │   └── api/                 # API client
    └── ...
```

## Features

### Backend (NestJS)
- ✅ RESTful API with NestJS
- ✅ MongoDB integration with Mongoose
- ✅ JWT authentication for admin
- ✅ Questions management (CRUD)
- ✅ Game session tracking
- ✅ Game configuration management
- ✅ Leaderboard system
- ✅ Statistics and analytics

### Admin Dashboard
- ✅ Secure login system
- ✅ Dashboard with statistics
- ✅ Questions management (Add/Edit/Delete)
- ✅ Game configuration controls
- ✅ Session monitoring
- ✅ Seed questions from frontend
- ✅ Professional UI with Tailwind CSS

### Frontend (Game)
- ✅ Tactical military-themed UI
- ✅ Multi-level quiz system
- ✅ Real-time timer
- ✅ Dynamic question loading
- ✅ Score tracking
- ✅ Level progression system

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or download from https://www.mongodb.com/try/download/community

# Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Use in .env file

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URL
# MONGODB_URI=mongodb://localhost:27017/classwars
# or
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/classwars

# Build the project
npm run build

# Seed database with questions
npm run seed

# Start backend server
npm run start:dev
```

Backend will run on: http://localhost:5000

### 3. Admin Dashboard Setup

```bash
cd admin-dashboard

# Install dependencies
npm install

# Start admin dashboard
npm run dev
```

Admin Dashboard will run on: http://localhost:3001

### 4. Frontend (Game) Setup

```bash
# From project root
npm install

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## Default Admin Credentials

After seeding, create an admin account:

```bash
# Use the admin dashboard register endpoint or create via API:
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@classwars.com","password":"admin123"}'
```

Then login with:
- Email: `admin@classwars.com`
- Password: `admin123`

## API Endpoints

### Public Endpoints
- `GET /questions/random?level=1` - Get random question by level
- `GET /questions/by-level?level=1` - Get all questions for level
- `POST /game/session` - Create game session
- `POST /game/session/:id/answer` - Submit answer
- `GET /game/leaderboard` - Get top players
- `GET /game/config` - Get game configuration

### Admin Endpoints (Requires JWT)
- `POST /auth/login` - Admin login
- `GET /admin/questions` - Get all questions
- `POST /admin/questions` - Create question
- `PUT /admin/questions/:id` - Update question
- `DELETE /admin/questions/:id` - Delete question
- `POST /admin/questions/seed` - Seed questions
- `GET /admin/config` - Get game config
- `PUT /admin/config` - Update game config
- `GET /admin/sessions` - Get all sessions
- `GET /admin/stats` - Get statistics

## Database Collections

### questions
```javascript
{
  id: Number,
  level: Number,
  type: 'oneword' | 'code' | 'mcq',
  text: String,
  code?: String,
  options?: String[],
  correct: String,
  isActive: Boolean
}
```

### game_sessions
```javascript
{
  playerName: String,
  playerEmail: String,
  currentLevel: Number,
  totalPoints: Number,
  correctInLevel: Number,
  consecutiveWrong: Number,
  timeRemaining: Number,
  status: 'active' | 'completed' | 'timeout',
  answeredQuestions: Array,
  completedAt?: Date
}
```

### game_configs
```javascript
{
  configName: String,
  totalGameTime: Number,
  questionTimeout: Number,
  pointsPerCorrect: Number,
  maxConsecutiveWrong: Number,
  maxLevel: Number,
  isActive: Boolean
}
```

### admins
```javascript
{
  email: String,
  password: String (hashed),
  role: String
}
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/classwars
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
ADMIN_EMAIL=admin@classwars.com
ADMIN_PASSWORD=admin123
```

## Development Workflow

1. Start MongoDB
2. Start Backend: `cd backend && npm run start:dev`
3. Start Admin Dashboard: `cd admin-dashboard && npm run dev`
4. Start Frontend: `npm run dev`

## Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Admin Dashboard
```bash
cd admin-dashboard
npm run build
# Serve dist folder with nginx or similar
```

### Frontend
```bash
npm run build
# Serve dist folder with nginx or similar
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- For Atlas, whitelist your IP address

### CORS Issues
- Backend CORS is configured for localhost:3000 and localhost:5173
- Update in `backend/src/main.ts` if needed

### Port Conflicts
- Backend: Change PORT in .env
- Admin: Change port in admin-dashboard/vite.config.ts
- Frontend: Change port in vite.config.ts

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Motion
- **Backend**: NestJS, MongoDB, Mongoose, JWT, Passport
- **Admin**: React 19, TypeScript, Tailwind CSS, React Router, Axios

## License

Apache-2.0
