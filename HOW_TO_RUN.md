# How to Run ClassWars

## 📁 Project Structure

```
ClassWars-Round1-DevDay-2026/
│
├── frontend/          ← React app (Game + Admin Dashboard)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
└── backend/           ← NestJS API
    ├── src/
    ├── .env
    └── package.json
```

## 🚀 Step-by-Step

### Step 1: Backend

Open Terminal 1:

```bash
cd backend
npm install
npm run start:dev
```

✅ Backend running on: **http://localhost:3002**

### Step 2: Frontend

Open Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running on: **http://localhost:3000**

## 🌐 Open in Browser

### Game Interface
http://localhost:3000

### Admin Dashboard
http://localhost:3000/admin/login

**Login Credentials:**
- Email: `admin@classwars.com`
- Password: `admin123`

## ✅ Verification

- [ ] Backend terminal shows: `🚀 Backend running on http://localhost:3002`
- [ ] Frontend terminal shows: `Local: http://localhost:3000/`
- [ ] Game opens at http://localhost:3000
- [ ] Admin login works at http://localhost:3000/admin/login

## 📝 Notes

- Dono folders **independent** hain
- Har folder mein apna `package.json` hai
- Har folder mein apna `node_modules` hai
- Dono ko **separately** run karna hai

## 🛠️ Commands

### Frontend Commands
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Run dev server
npm run build        # Build for production
```

### Backend Commands
```bash
cd backend
npm install          # Install dependencies
npm run start:dev    # Run dev server
npm run build        # Build for production
npm run seed         # Seed database
```

## 🎯 Summary

1. `cd backend` → `npm install` → `npm run start:dev`
2. `cd frontend` → `npm install` → `npm run dev`
3. Open http://localhost:3000

Done! 🎉
