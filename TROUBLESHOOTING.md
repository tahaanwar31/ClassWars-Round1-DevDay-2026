# Troubleshooting Guide

## "Unauthorized" Error When Adding Teams

### Problem
Getting "Unauthorized" error when trying to add teams from admin dashboard.

### Solution

**Step 1: Login to Admin Dashboard**
1. Go to http://localhost:3000/admin/login
2. Enter credentials:
   - Email: `admin@classwars.com`
   - Password: `admin123`
3. Click Login

**Step 2: Add Teams**
1. After successful login, go to Teams page
2. Click "Add Team"
3. Enter team name and password
4. Click "Add Team"

### Why This Happens
- Admin endpoints (`/admin/*`) require JWT authentication
- You must login first to get a JWT token
- The token is stored in localStorage
- All admin API calls include this token in the Authorization header

### Check If You're Logged In
Open browser console and run:
```javascript
localStorage.getItem('token')
```
- If it returns `null`, you need to login
- If it returns a token string, you're logged in

### If Still Getting Error After Login

**Option 1: Clear localStorage and login again**
```javascript
localStorage.clear()
```
Then login again at `/admin/login`

**Option 2: Check if backend is running**
- Backend should be running on http://localhost:3002
- Check terminal for backend logs

**Option 3: Check browser console**
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab to see the actual API request

## Team Login Issues

### Problem
Teams can't login at http://localhost:3000

### Solution

**Option 1: Register teams from admin dashboard**
1. Login to admin at `/admin/login`
2. Go to `/admin/teams`
3. Add teams with name and password

**Option 2: Use seed script**
```bash
cd backend
npm run seed
```

This creates 5 test teams:
- Team Alpha (password: alpha123)
- Team Beta (password: beta123)
- Team Gamma (password: gamma123)
- Team Delta (password: delta123)
- Team Epsilon (password: epsilon123)

## Backend Not Starting

### Check MongoDB Connection
1. Open `backend/.env`
2. Verify `MONGODB_URI` is correct
3. Make sure MongoDB Atlas cluster is running

### Check Port
- Backend uses port 3002
- Make sure nothing else is using this port

## Frontend Not Starting

### Check Port
- Frontend uses port 3000
- Make sure nothing else is using this port

### Reinstall Dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Leaderboard Not Showing Teams

### Possible Causes
1. No teams have completed a game yet
2. Teams are inactive
3. Backend not connected to database

### Solution
1. Make sure teams play and complete at least one game
2. Check team status in `/admin/teams` (should be Active)
3. Check backend logs for database connection

## Questions Not Loading

### Solution
1. Login to admin
2. Go to `/admin/questions`
3. Click "Seed from Frontend" button
4. This will load 25 default questions

## API Endpoints Reference

### Public Endpoints (No Auth Required)
```
POST /teams/login
GET /teams/leaderboard
```

### Admin Endpoints (Requires JWT Token)
```
POST /admin/teams
GET /admin/teams
DELETE /admin/teams/:teamName
PUT /admin/teams/:teamName/toggle
GET /admin/leaderboard
POST /admin/questions
GET /admin/questions
PUT /admin/questions/:id
DELETE /admin/questions/:id
```

## Quick Test Flow

1. **Start Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Seed Data** (Optional)
   ```bash
   cd backend
   npm run seed
   ```

4. **Login to Admin**
   - Go to http://localhost:3000/admin/login
   - Email: admin@classwars.com
   - Password: admin123

5. **Add a Team**
   - Go to Teams page
   - Click "Add Team"
   - Name: TestTeam
   - Password: test123

6. **Test Team Login**
   - Go to http://localhost:3000
   - Team Name: TestTeam
   - Password: test123

7. **Check Leaderboard**
   - Login to admin
   - Go to Leaderboard page
   - Should show teams after they play

## Common Errors

### "Cannot find module"
```bash
cd backend  # or frontend
npm install
```

### "Port already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 3002
lsof -ti:3002 | xargs kill
```

### "MongoDB connection failed"
- Check `backend/.env` file
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings

### "Token expired"
- Logout and login again
- Or clear localStorage: `localStorage.clear()`

## Need More Help?

Check these files:
- `TEAM_COMPETITION_SETUP.md` - Complete system documentation
- `README.md` - Project overview
- `HOW_TO_RUN.md` - Step-by-step run guide
