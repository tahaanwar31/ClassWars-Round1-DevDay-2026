# ClassWars Team Competition System

## ✅ What's Implemented

### Backend Changes

1. **Team Schema** (`backend/src/schemas/team.schema.ts`)
   - Team name (unique)
   - Password (hashed with bcrypt)
   - Total score (cumulative across all games)
   - Games played counter
   - Best score (highest single game score)
   - Active/inactive status
   - Session IDs array

2. **Updated GameSession Schema**
   - Changed from `playerName` + `playerEmail` to `teamName`
   - Links sessions to teams

3. **Teams Module** (`backend/src/teams/`)
   - Team login endpoint
   - Leaderboard endpoint
   - Team registration (admin only)
   - Score tracking

4. **Admin Endpoints** (added to `/admin`)
   - `GET /admin/teams` - List all teams
   - `POST /admin/teams` - Register new team
   - `DELETE /admin/teams/:teamName` - Delete team
   - `PUT /admin/teams/:teamName/toggle` - Activate/deactivate team
   - `GET /admin/leaderboard` - Get leaderboard

5. **Fixed Questions API**
   - Auto-generates question ID if not provided
   - Properly handles level, text, type, code, options, correct answer

6. **Game Service Updates**
   - Creates sessions with team name
   - Automatically updates team scores when session ends
   - Tracks best score per team

### Frontend Changes

1. **Team Login Page** (`/`)
   - Team name + password authentication
   - Redirects to game after login
   - Stores team data in localStorage

2. **Admin - Teams Page** (`/admin/teams`)
   - View all teams
   - Add new teams
   - Delete teams
   - Toggle active/inactive status
   - Shows total score, games played, best score

3. **Admin - Leaderboard Page** (`/admin/leaderboard`)
   - Real-time leaderboard
   - Ranked by total score, then best score
   - Shows top 3 with special icons
   - Auto-refreshes every 10 seconds
   - Manual refresh button

4. **Fixed Questions Page** (`/admin/questions`)
   - Add/Edit modal with proper fields:
     - Level (number)
     - Type (oneword/mcq/code)
     - Question text
     - Code snippet (for code type)
     - Options (for MCQ)
     - Correct answer
   - Seed from frontend button

5. **Updated Navigation**
   - Added Teams and Leaderboard to admin menu
   - Team login as default route

## 🎯 Competition Flow

### For Teams

1. **Login**
   - Visit http://localhost:3000
   - Enter team name and password
   - Click "Start Game"

2. **Play Game**
   - Answer questions
   - Earn points
   - Complete session

3. **Scoring**
   - Each correct answer: +5 points
   - Session score added to team's total score
   - Best score tracked automatically

### For Admins

1. **Register Teams**
   - Go to `/admin/teams`
   - Click "Add Team"
   - Enter team name and password
   - Team can now login

2. **Monitor Competition**
   - View leaderboard at `/admin/leaderboard`
   - See real-time rankings
   - Track team progress

3. **Manage Questions**
   - Add/edit questions at `/admin/questions`
   - Set level, type, and content
   - Seed default questions if needed

## 📊 Leaderboard System

### Ranking Logic
1. Primary: Total Score (sum of all game sessions)
2. Secondary: Best Score (highest single session)

### Score Calculation
- Total Score = Sum of all completed game session scores
- Best Score = Highest score from any single session
- Games Played = Number of completed sessions

### Example
```
Team A: 3 games (50, 75, 60) = Total: 185, Best: 75
Team B: 2 games (90, 80) = Total: 170, Best: 90
Ranking: Team A (higher total score)
```

## 🔐 Security

- Team passwords hashed with bcrypt
- Admin routes protected with JWT
- Team authentication required for game access

## 📡 API Endpoints

### Public Endpoints
```
POST /teams/login
  Body: { teamName, password }
  Returns: { teamName, totalScore, gamesPlayed, bestScore }

GET /teams/leaderboard
  Returns: Array of teams sorted by score
```

### Admin Endpoints (Requires JWT)
```
GET /admin/teams
  Returns: All teams with stats

POST /admin/teams
  Body: { teamName, password }
  Returns: Success message

DELETE /admin/teams/:teamName
  Returns: Deleted team

PUT /admin/teams/:teamName/toggle
  Returns: Updated team

GET /admin/leaderboard
  Returns: Active teams leaderboard

POST /admin/questions
  Body: { level, type, text, code?, options?, correct }
  Returns: Created question
```

## 🗄️ Database Collections

### class_wars_teams
```javascript
{
  teamName: String (unique),
  password: String (hashed),
  totalScore: Number,
  gamesPlayed: Number,
  bestScore: Number,
  isActive: Boolean,
  sessionIds: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### class_wars_sessions
```javascript
{
  teamName: String,
  currentLevel: Number,
  totalPoints: Number,
  correctInLevel: Number,
  consecutiveWrong: Number,
  timeRemaining: Number,
  status: String,
  answeredQuestions: Array,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### class_wars_questions
```javascript
{
  id: Number,
  level: Number,
  type: String (oneword/mcq/code),
  text: String,
  code: String (optional),
  options: [String] (optional),
  correct: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 How to Run

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎮 Access Points

- **Team Login**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Email: `admin@classwars.com`
  - Password: `admin123`

## ✅ Scalability

The system is designed to handle multiple teams:

- ✅ Unique team names enforced at database level
- ✅ Indexed queries for fast leaderboard retrieval
- ✅ Efficient score aggregation
- ✅ Session tracking per team
- ✅ No hardcoded limits on team count
- ✅ Automatic score updates on session completion

## 🎯 Testing Checklist

- [ ] Register multiple teams from admin dashboard
- [ ] Teams can login with credentials
- [ ] Teams can play game and earn points
- [ ] Scores update in leaderboard after game completion
- [ ] Leaderboard ranks teams correctly
- [ ] Admin can add/edit/delete questions
- [ ] Admin can activate/deactivate teams
- [ ] Multiple teams can play simultaneously

## 📝 Notes

- Team passwords are hashed and cannot be retrieved
- Inactive teams cannot login but their scores remain
- Leaderboard only shows active teams
- Admin can reset competition by deleting all teams
- Questions can be seeded from frontend or added manually
