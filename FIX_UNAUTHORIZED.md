# Fix "Unauthorized" Error

## The Problem
You're getting "Unauthorized" when trying to add teams because you need to login to admin first.

## Quick Fix (3 Steps)

### Step 1: Login to Admin
1. Open browser
2. Go to: **http://localhost:3000/admin/login**
3. Enter:
   - Email: `admin@classwars.com`
   - Password: `admin123`
4. Click "Login"

### Step 2: Go to Teams Page
- After login, you'll be at `/admin/dashboard`
- Click "Teams" in the navigation menu
- Or go directly to: **http://localhost:3000/admin/teams**

### Step 3: Add Team
1. Click "Add Team" button
2. Enter team name and password
3. Click "Add Team"
4. ✅ Should work now!

## Why This Happens

The `/admin/teams` endpoint requires authentication:
- You must be logged in as admin
- A JWT token is needed
- Token is stored when you login
- Token is sent with every admin API request

## Alternative: Use Seed Script

If you want to quickly create test teams:

```bash
cd backend
npm run seed
```

This creates 5 teams:
- Team Alpha / alpha123
- Team Beta / beta123
- Team Gamma / gamma123
- Team Delta / delta123
- Team Epsilon / epsilon123

## Check If You're Logged In

Open browser console (F12) and type:
```javascript
localStorage.getItem('token')
```

- If `null` → You need to login
- If shows a long string → You're logged in ✅

## Still Not Working?

1. **Clear cache and login again:**
   ```javascript
   localStorage.clear()
   ```
   Then login again

2. **Check backend is running:**
   - Should see: `🚀 Backend running on http://localhost:3002`

3. **Check browser console:**
   - Press F12
   - Look for error messages
   - Check Network tab for failed requests

## Summary

**The fix is simple: Login to admin first!**

1. http://localhost:3000/admin/login
2. admin@classwars.com / admin123
3. Then add teams

That's it! 🎉
