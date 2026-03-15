# 🚀 START HERE - ClassWars Complete Guide

## 📋 What You Have

A full-stack trivia game with:
- **Game Interface** - Play trivia questions
- **Admin Dashboard** - Manage content (integrated in same frontend)
- **Backend API** - NestJS + MongoDB

## 🎯 Quick Start (3 Steps)

### Step 1: Install
```bash
npm run install:all
```

### Step 2: Configure (if needed)
Backend is already configured. If you need to change MongoDB:
```bash
cd backend
# Edit .env file with your MongoDB URI
```

### Step 3: Run
```bash
npm run dev
```

That's it! 🎉

## 🌐 Access Your Application

Open your browser:

1. **Play the Game**: http://localhost:3000
2. **Admin Panel**: http://localhost:3000/admin/login
   - Email: `admin@classwars.com`
   - Password: `admin123`

## 📁 Project Structure

```
/
├── src/                    # All frontend code
│   ├── components/        # Game components
│   ├── pages/admin/       # Admin pages (Login, Dashboard, etc.)
│   └── api/               # API utilities
│
└── backend/               # Backend API
    └── src/               # Backend code
```

## 🛠️ Common Commands

```bash
# Run everything
npm run dev

# Run separately
npm run dev:frontend    # Just the frontend
npm run dev:backend     # Just the backend

# Build for production
npm run build

# Seed database with sample data
npm run seed
```

## 🎮 How It Works

### Game Flow
1. User visits http://localhost:3000
2. Plays trivia questions
3. Gets scored in real-time

### Admin Flow
1. Admin visits http://localhost:3000/admin/login
2. Logs in with credentials
3. Can:
   - View dashboard statistics
   - Add/edit/delete questions
   - Configure game settings
   - Monitor game sessions

### Routes
- `/` → Game interface
- `/admin/login` → Admin login
- `/admin/dashboard` → Admin overview
- `/admin/questions` → Manage questions
- `/admin/config` → Game settings
- `/admin/sessions` → View sessions

## 🔧 Troubleshooting

### "Port already in use"
Kill processes on ports 3000 or 3002:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill
lsof -ti:3002 | xargs kill
```

### "Cannot connect to MongoDB"
Check `backend/.env` file has correct `MONGODB_URI`

### "Module not found"
Reinstall dependencies:
```bash
npm run install:all
```

## 📚 More Documentation

- `README.md` - Full documentation
- `QUICKSTART.md` - Quick start guide
- `PROJECT_STRUCTURE.md` - Detailed structure
- `SETUP_COMPLETE.md` - What was done

## ✅ Verification

Test everything works:

1. ✅ Frontend runs on port 3000
2. ✅ Backend runs on port 3002
3. ✅ Game loads at http://localhost:3000
4. ✅ Admin login works at http://localhost:3000/admin/login
5. ✅ Can navigate admin pages after login

## 🎨 Key Features

### Unified Frontend
- Single application for game + admin
- React Router for navigation
- Shared components and utilities
- Clean, organized structure

### Security
- JWT authentication
- Protected admin routes
- Secure API calls
- Token-based sessions

### Developer Experience
- Hot reload for both frontend and backend
- TypeScript for type safety
- Concurrent dev servers
- Easy build and deployment

## 🚀 Next Steps

1. Run `npm run dev`
2. Visit http://localhost:3000
3. Play the game
4. Login to admin at http://localhost:3000/admin/login
5. Explore and customize!

---

**Need Help?** Check the documentation files or review the code structure.

**Ready to Deploy?** Run `npm run build` to create production builds.
