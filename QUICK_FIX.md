# Quick Fix for "Unauthorized" Error

## Problem
Getting "Unauthorized" when adding teams from admin dashboard.

## Solution (Choose One)

### Option 1: Login First (Recommended)

1. **Go to admin login:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Enter credentials:**
   - Email: `admin@classwars.com`
   - Password: `admin123`

3. **Click Login**

4. **Now go to Teams page and add teams** ✅

---

### Option 2: Create Admin User (If Login Doesn't Work)

If admin login says "Invalid credentials", create admin user:

```bash
cd backend
npm run create-admin
```

This will create:
- Email: `admin@classwars.com`
- Password: `admin123`

Then try Option 1 again.

---

### Option 3: Seed Everything (Teams + Questions + Admin)

```bash
cd backend
npm run seed
```

This creates:
- Admin user
- 5 test teams
- 25 questions

**Test teams created:**
- Team Alpha / alpha123
- Team Beta / beta123
- Team Gamma / gamma123
- Team Delta / delta123
- Team Epsilon / epsilon123

---

## Complete Setup Flow

### 1. Start Backend
```bash
cd backend
npm install
npm run create-admin    # Create admin user
npm run seed           # Seed data (optional)
npm run start:dev      # Start server
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Login to Admin
- Go to: http://localhost:3000/admin/login
- Email: admin@classwars.com
- Password: admin123

### 4. Add Teams
- Go to Teams page
- Click "Add Team"
- Enter name and password
- Done! ✅

---

## Why "Unauthorized" Happens

Admin endpoints need authentication:
```
/admin/teams        ← Needs JWT token
/admin/questions    ← Needs JWT token
/admin/leaderboard  ← Needs JWT token
```

You get the JWT token by logging in at `/admin/login`.

---

## Check If You're Logged In

Open browser console (F12):
```javascript
localStorage.getItem('token')
```

- `null` = Not logged in → Login first
- Long string = Logged in ✅

---

## Still Having Issues?

### Clear Everything and Start Fresh
```javascript
// In browser console
localStorage.clear()
```

Then:
1. Login to admin again
2. Try adding team

### Check Backend is Running
Terminal should show:
```
🚀 Backend running on http://localhost:3002
```

### Check MongoDB Connection
Open `backend/.env` and verify `MONGODB_URI` is correct.

---

## Summary

**The fix:** Login to admin first, then add teams!

1. http://localhost:3000/admin/login
2. admin@classwars.com / admin123  
3. Add teams ✅

That's it! 🎉
