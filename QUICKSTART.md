# ClassWars Quick Start Guide

## Setup (First Time Only)

1. **Install Dependencies**
```bash
npm run install:all
```

2. **Configure Backend**
```bash
cd backend
cp .env.example .env
```
Edit `.env` and add your MongoDB URI (already configured if using existing .env)

3. **Seed Database**
```bash
npm run seed
```

## Running the Application

### Option 1: Run Everything Together
```bash
npm run dev
```

This starts:
- Backend API on http://localhost:3002
- Frontend (Game + Admin) on http://localhost:3000

### Option 2: Run Separately

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

## Access the Application

1. **Game Interface**: http://localhost:3000
   - Play the trivia game

2. **Admin Dashboard**: http://localhost:3000/admin/login
   - Login with:
     - Email: `admin@classwars.com`
     - Password: `admin123`
   - Manage questions, config, and sessions

## Project Structure

```
/
├── src/                    # Frontend source
│   ├── components/        # Game components
│   ├── pages/admin/       # Admin pages
│   └── api/               # API utilities
├── backend/               # Backend API
│   └── src/
└── package.json           # Root scripts
```

## Common Commands

```bash
# Development
npm run dev                 # Run both frontend & backend
npm run dev:frontend        # Frontend only
npm run dev:backend         # Backend only

# Build
npm run build              # Build both
npm run build:frontend     # Frontend only
npm run build:backend      # Backend only

# Database
npm run seed               # Seed database

# Type checking
npm run lint               # Check TypeScript types
```

## Troubleshooting

### Port Already in Use
If you get port errors:
- Frontend uses port 3000
- Backend uses port 3002
- Kill processes using these ports or change them in:
  - Frontend: `vite.config.ts`
  - Backend: `backend/.env`

### MongoDB Connection Error
- Check your `MONGODB_URI` in `backend/.env`
- Ensure MongoDB Atlas cluster is running
- Check network access settings in MongoDB Atlas

### Module Not Found
```bash
npm run install:all
```

## Next Steps

1. Visit http://localhost:3000 to play the game
2. Visit http://localhost:3000/admin/login to manage content
3. Check API at http://localhost:3002
4. Read full documentation in README.md
