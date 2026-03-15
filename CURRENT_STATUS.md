# ClassWars - Current Status

## ✅ Successfully Running

### 1. Frontend Game
- **Status**: ✅ RUNNING
- **URL**: http://localhost:3000
- **Port**: 3000
- **Description**: The tactical military-themed quiz game

### 2. Admin Dashboard
- **Status**: ✅ RUNNING
- **URL**: http://localhost:3001
- **Port**: 3001
- **Description**: Professional admin control panel

### 3. Backend API
- **Status**: ⚠️ WAITING FOR MONGODB
- **Port**: 5000 (will run when MongoDB connects)
- **Issue**: Trying to connect to MongoDB

## 📋 MongoDB Collections

When the backend connects to your MongoDB Atlas URI, it will automatically create these collections:

### 1. `questions`
Stores all quiz questions with:
- id, level, type (oneword/code/mcq)
- text, code (optional), options (for MCQ)
- correct answer
- isActive status
- timestamps

### 2. `gamesessions`
Tracks player game sessions with:
- playerName, playerEmail
- currentLevel, totalPoints
- correctInLevel, consecutiveWrong
- timeRemaining, status
- answeredQuestions array
- timestamps

### 3. `gameconfigs`
Stores game configuration:
- configName (default: "default")
- totalGameTime (default: 3600 seconds)
- questionTimeout (default: 60 seconds)
- pointsPerCorrect (default: 5)
- maxConsecutiveWrong (default: 2)
- maxLevel (default: 10)
- timestamps

### 4. `admins`
Admin user accounts:
- email (unique)
- password (bcrypt hashed)
- role (default: "admin")
- timestamps

## 🔧 Next Steps

### 1. Update MongoDB URI in backend/.env

Your `backend/.env` file should have your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/classwars?retryWrites=true&w=majority
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03e0a0c7d3e3a012b8c3f59f3a4c6e7f2b1d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
PORT=5000
```

Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### 2. Restart Backend

Once you update the MongoDB URI:

```bash
# The backend will automatically restart (watch mode is enabled)
# Or manually restart if needed
```

### 3. Seed the Database

After backend connects successfully:

```bash
cd backend
npm run seed
```

This will populate the `questions` collection with 25 quiz questions.

### 4. Create Admin Account

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@classwars.com","password":"admin123"}'
```

This creates an admin user in the `admins` collection.

## 📊 Collection Details

### Questions Collection Structure
```javascript
{
  "_id": ObjectId("..."),
  "id": 1,
  "level": 1,
  "type": "oneword",
  "text": "Question text...",
  "correct": "Answer",
  "isActive": true,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### Game Sessions Collection Structure
```javascript
{
  "_id": ObjectId("..."),
  "playerName": "John Doe",
  "playerEmail": "john@example.com",
  "currentLevel": 1,
  "totalPoints": 0,
  "correctInLevel": 0,
  "consecutiveWrong": 0,
  "timeRemaining": 3600,
  "status": "active",
  "answeredQuestions": [],
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### Game Config Collection Structure
```javascript
{
  "_id": ObjectId("..."),
  "configName": "default",
  "totalGameTime": 3600,
  "questionTimeout": 60,
  "pointsPerCorrect": 5,
  "maxConsecutiveWrong": 2,
  "maxLevel": 10,
  "isActive": true,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### Admins Collection Structure
```javascript
{
  "_id": ObjectId("..."),
  "email": "admin@classwars.com",
  "password": "$2b$10$...", // bcrypt hashed
  "role": "admin",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## 🎯 How Collections Are Created

The collections are created automatically by Mongoose when:

1. **Backend connects to MongoDB** - Mongoose registers all schemas
2. **First document is inserted** - Collection is created with the schema structure
3. **Indexes are created** - Unique indexes (like email in admins) are set up

You don't need to manually create collections - they're created automatically!

## 🔍 Verify Collections in MongoDB Atlas

Once backend connects and data is seeded:

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select your database (classwars)
4. You should see 4 collections:
   - questions (25 documents after seeding)
   - gamesessions (empty initially)
   - gameconfigs (1 document - default config)
   - admins (1 document after creating admin)

## 📝 Current Access Points

- **Frontend Game**: http://localhost:3000 ✅
- **Admin Dashboard**: http://localhost:3001 ✅
- **Backend API**: http://localhost:5000 (waiting for MongoDB)

## ⚡ Quick Commands

```bash
# Check backend logs
# (Already running in watch mode)

# Seed database (after MongoDB connects)
cd backend && npm run seed

# Create admin account
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@classwars.com","password":"admin123"}'

# Test API
curl http://localhost:5000/game/config
```

## 🎉 Summary

- ✅ All dependencies installed
- ✅ Frontend running on port 3000
- ✅ Admin dashboard running on port 3001
- ⏳ Backend waiting for MongoDB connection
- 📦 Collections will be created automatically
- 🔧 Update MongoDB URI in backend/.env to proceed

Once you update the MongoDB URI, the backend will connect and create all 4 collections automatically!
