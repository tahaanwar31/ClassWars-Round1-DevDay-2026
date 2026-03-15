# ClassWars API Documentation

Base URL: `http://localhost:5000`

## Authentication

Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Public Endpoints

### Questions

#### Get Random Question
```http
GET /questions/random?level=1
```

**Query Parameters:**
- `level` (number): Question difficulty level (1-10)

**Response:**
```json
{
  "_id": "...",
  "id": 1,
  "level": 1,
  "type": "oneword",
  "text": "Question text...",
  "correct": "Answer",
  "isActive": true
}
```

#### Get Questions by Level
```http
GET /questions/by-level?level=1
```

**Response:**
```json
[
  {
    "_id": "...",
    "id": 1,
    "level": 1,
    "type": "mcq",
    "text": "Question text...",
    "options": ["A) Option 1", "B) Option 2"],
    "correct": "A) Option 1"
  }
]
```

### Game

#### Create Game Session
```http
POST /game/session
```

**Request Body:**
```json
{
  "playerName": "John Doe",
  "playerEmail": "john@example.com"
}
```

**Response:**
```json
{
  "_id": "session_id",
  "playerName": "John Doe",
  "playerEmail": "john@example.com",
  "currentLevel": 1,
  "totalPoints": 0,
  "status": "active",
  "timeRemaining": 3600
}
```

#### Get Session
```http
GET /game/session/:id
```

**Response:**
```json
{
  "_id": "session_id",
  "playerName": "John Doe",
  "currentLevel": 3,
  "totalPoints": 25,
  "correctInLevel": 1,
  "consecutiveWrong": 0,
  "timeRemaining": 3200,
  "status": "active",
  "answeredQuestions": [...]
}
```

#### Submit Answer
```http
POST /game/session/:id/answer
```

**Request Body:**
```json
{
  "questionId": 1,
  "answer": "Encapsulation",
  "isCorrect": true
}
```

**Response:**
```json
{
  "_id": "session_id",
  "currentLevel": 2,
  "totalPoints": 5,
  "correctInLevel": 0,
  "consecutiveWrong": 0
}
```

#### End Session
```http
POST /game/session/:id/end
```

**Response:**
```json
{
  "_id": "session_id",
  "status": "completed",
  "completedAt": "2026-03-13T10:30:00.000Z",
  "totalPoints": 45
}
```

#### Get Leaderboard
```http
GET /game/leaderboard?limit=10
```

**Query Parameters:**
- `limit` (number, optional): Number of top players (default: 10)

**Response:**
```json
[
  {
    "playerName": "John Doe",
    "playerEmail": "john@example.com",
    "totalPoints": 85,
    "currentLevel": 8,
    "completedAt": "2026-03-13T10:30:00.000Z"
  }
]
```

#### Get Game Config
```http
GET /game/config
```

**Response:**
```json
{
  "totalGameTime": 3600,
  "questionTimeout": 60,
  "pointsPerCorrect": 5,
  "maxConsecutiveWrong": 2,
  "maxLevel": 10
}
```

## Admin Endpoints (Protected)

### Authentication

#### Admin Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@classwars.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "email": "admin@classwars.com",
    "role": "admin"
  }
}
```

#### Admin Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "admin@classwars.com",
  "password": "admin123"
}
```

### Questions Management

#### Get All Questions
```http
GET /admin/questions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "...",
    "id": 1,
    "level": 1,
    "type": "oneword",
    "text": "Question text...",
    "correct": "Answer",
    "isActive": true,
    "createdAt": "2026-03-13T10:00:00.000Z"
  }
]
```

#### Create Question
```http
POST /admin/questions
```

**Request Body:**
```json
{
  "id": 26,
  "level": 6,
  "type": "mcq",
  "text": "What is polymorphism?",
  "options": ["A) Option 1", "B) Option 2"],
  "correct": "A) Option 1",
  "isActive": true
}
```

#### Update Question
```http
PUT /admin/questions/:id
```

**Request Body:**
```json
{
  "text": "Updated question text",
  "correct": "Updated answer"
}
```

#### Delete Question
```http
DELETE /admin/questions/:id
```

**Response:**
```json
{
  "message": "Question deleted successfully"
}
```

#### Seed Questions
```http
POST /admin/questions/seed
```

**Request Body:**
```json
{
  "questions": [
    {
      "id": 1,
      "level": 1,
      "type": "oneword",
      "text": "Question...",
      "correct": "Answer"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Questions seeded successfully",
  "count": 25
}
```

### Game Configuration

#### Get Config
```http
GET /admin/config
```

**Response:**
```json
{
  "_id": "...",
  "configName": "default",
  "totalGameTime": 3600,
  "questionTimeout": 60,
  "pointsPerCorrect": 5,
  "maxConsecutiveWrong": 2,
  "maxLevel": 10,
  "isActive": true
}
```

#### Update Config
```http
PUT /admin/config
```

**Request Body:**
```json
{
  "totalGameTime": 7200,
  "questionTimeout": 90,
  "pointsPerCorrect": 10,
  "maxConsecutiveWrong": 3,
  "maxLevel": 15
}
```

### Sessions Management

#### Get All Sessions
```http
GET /admin/sessions
```

**Response:**
```json
[
  {
    "_id": "...",
    "playerName": "John Doe",
    "playerEmail": "john@example.com",
    "currentLevel": 5,
    "totalPoints": 45,
    "status": "active",
    "createdAt": "2026-03-13T10:00:00.000Z"
  }
]
```

#### Get Session Details
```http
GET /admin/sessions/:id
```

**Response:**
```json
{
  "_id": "...",
  "playerName": "John Doe",
  "playerEmail": "john@example.com",
  "currentLevel": 5,
  "totalPoints": 45,
  "answeredQuestions": [
    {
      "questionId": 1,
      "answer": "Encapsulation",
      "isCorrect": true,
      "timestamp": "2026-03-13T10:05:00.000Z"
    }
  ],
  "status": "active"
}
```

#### Delete Session
```http
DELETE /admin/sessions/:id
```

### Statistics

#### Get Dashboard Stats
```http
GET /admin/stats
```

**Response:**
```json
{
  "totalSessions": 150,
  "activeSessions": 12,
  "completedSessions": 138,
  "totalQuestions": 25,
  "averagePoints": 42.5,
  "topPlayers": [
    {
      "playerName": "John Doe",
      "totalPoints": 85,
      "currentLevel": 8
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:
- Public endpoints: 100 requests/minute
- Admin endpoints: 1000 requests/minute

## CORS

CORS is enabled for:
- http://localhost:3000 (Frontend)
- http://localhost:5173 (Vite dev server)
- http://localhost:3001 (Admin dashboard)

Update in `backend/src/main.ts` for production domains.
