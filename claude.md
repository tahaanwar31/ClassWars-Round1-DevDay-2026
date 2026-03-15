# CLAUDE_IMPLEMENTATION_INSTRUCTIONS.md

## Project Context

This project is **ClassWars v2.0.0**, a full-stack **multi-round** team-based competition platform built with:

* **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
* **Backend:** NestJS 10 + TypeScript
* **Database:** MongoDB + Mongoose
* **Auth:** JWT for admin, bcrypt for passwords

The current platform already includes:

* team login
* admin login
* admin dashboard
* question management
* competition lobby
* round-aware session management
* round-specific configuration
* round-specific leaderboard
* Round 1 gameplay
* Round 2 placeholder / under construction page

The system is already functional as a multi-round platform. This task is to **enhance and harden it further**, not rebuild it from scratch.

---

# Instruction for Claude 4.5 Sonnet in Kiro

You are running inside **Kiro with Claude 4.5 Sonnet**.

While implementing this enhancement, **use any relevant Kiro/agent skills, project skills, workflow capabilities, codebase navigation helpers, refactoring helpers, or validation tools available in the environment** if they improve implementation quality, correctness, consistency, validation, maintainability, or performance.

Use them especially for:

* codebase navigation
* multi-file refactoring
* type-safe updates across frontend/backend
* DTO/schema/API/UI consistency checks
* performance-oriented improvements
* avoiding duplicate logic
* validating round timing and leaderboard logic across the codebase
* ensuring admin config, lobby rendering, and gameplay enforcement all stay in sync

### Important

* Do **not** use skills just for the sake of using them.
* Use only skills/workflows that are actually relevant.
* Prefer skills that improve:

  * correctness
  * maintainability
  * scalability
  * performance
  * safe refactoring
  * low regression risk

### Expected behavior

Claude should:

* inspect the current implementation first
* identify relevant Kiro skills/workflows/tools available in the environment
* use them where they meaningfully improve implementation quality
* still deliver fully working production-quality code

**Directive:** If relevant skills/tools/workflows are available in Kiro, use them to improve implementation quality and performance across the codebase.

---

# Main Goal

Enhance the existing multi-round competition platform so that:

1. Teams log in once.
2. They land on a **Competition Lobby**.
3. The lobby shows **general competition rules** in a dedicated section.
4. The lobby shows multiple round cards, at minimum:

   * **Round 1**
   * **Round 2**
5. Round entry is controlled by **admin-configurable round play window timings**.
6. Admin can manage:

   * round visibility
   * round status
   * round gameplay settings
   * round rules
   * round **start/end timings**
   * round **play access window**
7. Round 1 remains fully playable.
8. Round 2 remains visible but under construction.
9. Leaderboard logic remains round-aware and must be checked/fixed in admin dashboard.
10. Question loading must remain DB-backed, efficient, and scalable.
11. The solution must stay robust, scalable, and avoid wasteful polling or duplicate writes.

---

# High-Level Product Changes

## User Flow

### Current intended flow

* Team login
* Redirect to Competition Lobby
* Team sees available rounds
* Team enters Round 1 if allowed

### Required enhanced flow

* Team login
* Redirect to **Competition Lobby**
* Show:

  * dedicated **General Rules** section
  * round cards for Round 1 and Round 2
* Each round card must show:

  * round title
  * status
  * display timing
  * play access timing
  * rules summary
  * CTA button / access state
* Behavior:

  * if round is active and within play window → allow entry
  * if round is scheduled but not yet open → show disabled state
  * if round has ended → show disabled state
  * if round is under construction → show disabled state
  * if round is enabled but play access window is not open yet → do not allow play

---

# Required Functional Changes

---

## 1. Extend Round Configuration Model for Play Access Timing and Lobby General Rules

The system already has round-specific config. Extend it to support **separate, explicit round play access window handling** and **general lobby rules**.

### Requirement

Support both:

1. per-round timing configuration
2. a global set of general competition rules for the lobby

### Suggested config shape

A single config document may continue to exist, but it must support:

* general competition rules for the lobby
* per-round access/play window settings

Example:

```ts
{
  configName: "default",
  isActive: true,
  generalRules: [
    "Teams must use only their assigned credentials.",
    "Do not refresh repeatedly during gameplay.",
    "Any unfair means may result in disqualification."
  ],
  rounds: [
    {
      roundKey: "round1",
      roundName: "Round 1",
      enabled: true,
      status: "active", // active | scheduled | ended | under_construction
      underConstruction: false,

      // Existing or display timing
      startTime: Date | null,
      endTime: Date | null,

      // Explicit play access window
      playWindowStart: Date | null,
      playWindowEnd: Date | null,

      totalGameTimeSeconds: number,
      questionTimeoutSeconds: number,
      pointsPerCorrect: number,
      maxLevel: number,
      maxConsecutiveWrong: number,
      rules: string[],
      leaderboardEnabled: true
    },
    {
      roundKey: "round2",
      roundName: "Round 2",
      enabled: false,
      status: "under_construction",
      underConstruction: true,
      startTime: null,
      endTime: null,
      playWindowStart: null,
      playWindowEnd: null,
      totalGameTimeSeconds: 0,
      questionTimeoutSeconds: 0,
      pointsPerCorrect: 0,
      maxLevel: 0,
      maxConsecutiveWrong: 0,
      rules: ["This round is under construction."],
      leaderboardEnabled: false
    }
  ]
}
```

### Notes

* Do not hardcode rules/timings in frontend.
* Admin must manage these values from dashboard.
* Keep this extensible for future rounds.
* If `playWindowStart` / `playWindowEnd` are introduced, use them as the real gate for entering/playing the round.
* If you decide to reuse `startTime` / `endTime` as the same gate, do it consistently everywhere. But the recommended approach is to explicitly support the access/play window as its own concept.

---

## 2. Competition Lobby Must Show General Rules Section

### Requirement

Add a **General Rules** section in the Competition Lobby.

### Placement

* Show **below the round cards**
* or in a clearly separated section associated with the full competition
* user specifically wants a **general rules div in the lobby and below 2 rounds div**

### Behavior

This section must:

* render rules from backend config
* not be hardcoded static copy
* support multiple lines / bullet-style display
* look polished and consistent with the tactical theme

### Suggested heading

* `General Rules`
* `Competition Rules`
* `Mission Protocol`

### UX requirement

This must feel like a deliberate competition info section, not an afterthought.

---

## 3. Competition Lobby Must Enforce Admin-Controlled Round Play Windows

### Requirement

Rounds must not be enterable simply because they exist.

Admin must be able to define **when teams are allowed to play each round**, and the lobby must enforce it.

### Required behavior

A round is enterable only if all are true:

* team is active
* round is enabled
* round is not under construction
* round status allows play
* current time falls within configured play window

### States to handle

For each round, compute and display a clear access state:

* `Available Now`
* `Not Started Yet`
* `Closed`
* `Disabled`
* `Under Construction`

### CTA behavior

* if enterable → enabled “Enter Competition”
* else → disabled button with state text

### Backend responsibility

The backend must compute or validate enterability safely.
Do not rely only on frontend checks.

---

## 4. Round 1 Remains Playable, Round 2 Under Construction

### Requirement

Keep current Round 1 functionality but ensure it stays under a round-aware path, for example:

* `/competition/round1`

Round 2 should continue to exist as:

* `/competition/round2`

It should:

* remain visible
* show under construction state
* not be playable
* include back navigation to lobby

Do not implement Round 2 gameplay in this task.

---

## 5. Leaderboard Logic Must Stay Round-Aware and Must Be Reviewed in Admin Panel

### Requirement

Check the **admin leaderboard implementation carefully** and ensure it matches the intended ranking logic for the selected round.

### Required Round 1 ranking

Sort by:

1. `maxLevelReached DESC`
2. `totalPoints DESC`
3. `bestPoints DESC`

### What to verify/fix

* admin leaderboard must not accidentally fall back to legacy `totalScore/bestScore`
* correct round-aware fields must be used from `roundStats[roundKey]`
* response and UI must match
* columns shown in admin UI must align with new ranking logic

### Admin leaderboard must show

* Rank
* Team Name
* Max Level Reached
* Total Points
* Best Points
* Sessions Played
* optional status/active indicator if useful

### Optional but recommended

Allow round selector/filter in leaderboard page if not already present.

---

## 6. Admin Must Be Able to Configure Round Timings, Access Windows, Rules, and General Lobby Rules

### Requirement

The admin panel must support:

* viewing all round configs
* editing round timings
* editing round access/play window
* enabling/disabling rounds
* editing rules text
* marking round as under construction
* editing Round 1 gameplay settings
* editing lobby **general rules**

### Admin UI changes

The Round Config / Game Config page should support both:

1. **General Competition Rules**
2. **Per-Round Configuration**

### Fields per round

* round name
* round key
* enabled
* under construction
* status
* start datetime
* end datetime
* play window start datetime
* play window end datetime
* total game time seconds
* question timeout seconds
* points per correct
* max level
* max consecutive wrong
* leaderboard enabled
* rules list / multiline rules editor

### General rules editor

Add a separate section at top or bottom for:

* `generalRules: string[]`

### Validation

* end time must be after start time
* play window end must be after play window start
* if using both display timing and play timing, values must be coherent
* round under construction must not become enterable
* values must be sane and positive
* do not allow corrupt config

### Backend endpoints

Ensure proper endpoints exist and support these fields:

* `GET /admin/config/rounds`
* `PUT /admin/config/rounds/:roundKey`

If cleaner, you may also add:

* `GET /admin/config/general`
* `PUT /admin/config/general`

Or keep everything under one config payload if that is cleaner and consistent.

---

## 7. Competition Lobby API Must Return Enough Data

### Requirement

The lobby page must receive everything it needs from backend in one useful response.

### Recommended endpoint

```http
GET /competition/rounds
```

### Response should include

* `generalRules`
* list of rounds with:

  * roundKey
  * roundName
  * status
  * underConstruction
  * enabled
  * startTime
  * endTime
  * playWindowStart
  * playWindowEnd
  * rules
  * canEnter
  * accessState / availability label if useful

### Important

Backend should compute `canEnter` safely and consistently.

---

## 8. Sessions and Gameplay Must Respect Round Availability Window

### Requirement

Even if frontend tries to enter a round, backend must enforce access window at session creation time.

### Session creation rules

Before creating/reusing a session:

* team must exist
* team must be active
* round must exist
* round must be enabled
* round must not be under construction
* current time must be within allowed play window
* if active session already exists for same team+round, return it

### If round is not currently playable

Return a clear error like:

* round not yet started
* round closed
* round unavailable
* round under construction

---

## 9. Question Loading Must Remain DB-Backed and Efficient

### Requirement

Round 1 questions must continue to come from database only.

### Keep these guarantees

* do not use static frontend question data as source-of-truth
* use `roundKey + level + isActive`
* maintain efficient level-based question caching on frontend
* avoid repeated unnecessary calls

### Recommended question schema

Keep/support:

```ts
roundKey: string; // default "round1"
```

And query with:

* `roundKey`
* `level`
* `isActive`

---

## 10. Avoid Excessive API Calls and Preserve Scalability

This remains mandatory.

### Problems to avoid

* repeated fetch of same competition config
* repeated fetch of same general rules
* repeated fetch of same level questions
* repeated session creation requests
* duplicate leaderboard intervals
* duplicate score aggregation
* repeated admin config reload loops

### Required improvements

#### A. Lobby data fetching

* fetch competition lobby data once on page load
* do not refetch on every render
* use clean loading state
* optional refetch on manual refresh only

#### B. Question caching

* fetch level questions only when needed
* cache per session
* do not request same level repeatedly without need

#### C. Leaderboard polling

* only on leaderboard/admin page
* use reasonable interval
* clean up on unmount
* avoid duplicate intervals

#### D. Backend query efficiency

* use indexes
* select only required fields
* avoid unnecessary large payloads

#### E. Idempotent finalization

* session end must aggregate only once
* `isFinalized` must remain the guard

#### F. Active session reuse

* keep one active session per team per round
* return existing active session instead of creating duplicates

---

## 11. Improve / Preserve Team Aggregate Data Model

### Requirement

Continue to support round-specific stats.

### Team schema should support

```ts
roundStats: {
  round1: {
    totalPoints: number,
    bestPoints: number,
    maxLevelReached: number,
    sessionsPlayed: number
  },
  round2: {
    totalPoints: number,
    bestPoints: number,
    maxLevelReached: number,
    sessionsPlayed: number
  }
}
```

### Backward compatibility

If old fields still exist:

* keep safe compatibility
* new leaderboard/admin dashboard must use round-aware stats
* apply safe defaults for missing values

---

## 12. Update Admin Dashboard Layout and Visibility

### Requirement

The admin dashboard should feel like a real competition control panel.

### Improve dashboard and/or leaderboard page

* show round status summary cards
* show current round play windows
* show whether round is currently open/closed
* show round start/end timings
* show a clean dedicated leaderboard section
* show summary metrics:

  * teams participated
  * highest level reached
  * average points
  * active sessions

### Specific instruction

User explicitly said: **leaderboard in admin panel check kro**
So review the implementation end-to-end:

* backend response
* frontend rendering
* sorting correctness
* selected round behavior
* fields shown
* polling behavior
* empty state

Do not assume it is already correct just because some code exists.

---

# Detailed Backend Changes

---

## A. Update Schemas

### 1. `question.schema.ts`

Ensure:

* `roundKey: string` exists with default `"round1"`

Ensure indexes support:

* roundKey
* level
* isActive

Suggested compound index:

```ts
{ roundKey: 1, level: 1, isActive: 1 }
```

---

### 2. `game-session.schema.ts`

Ensure/support:

* `roundKey: string`
* `maxLevelReached: number`
* `isFinalized: boolean`

If not already present, keep:

```ts
roundKey: { type: String, required: true, default: 'round1' }
maxLevelReached: { type: Number, default: 1 }
isFinalized: { type: Boolean, default: false }
```

---

### 3. `team.schema.ts`

Ensure round-specific stats exist:

```ts
roundStats: {
  round1: {
    totalPoints: { type: Number, default: 0 },
    bestPoints: { type: Number, default: 0 },
    maxLevelReached: { type: Number, default: 0 },
    sessionsPlayed: { type: Number, default: 0 }
  },
  round2: {
    totalPoints: { type: Number, default: 0 },
    bestPoints: { type: Number, default: 0 },
    maxLevelReached: { type: Number, default: 0 },
    sessionsPlayed: { type: Number, default: 0 }
  }
}
```

---

### 4. `game-config.schema.ts`

Extend or confirm support for:

* `generalRules: string[]`
* per-round:

  * `startTime`
  * `endTime`
  * `playWindowStart`
  * `playWindowEnd`

Need proper schema typing and validation for nested round config objects.

---

## B. Update DTOs / Validation

Create or update DTOs for:

* create session with `roundKey`
* update round config
* update general rules if separated
* get competition lobby response
* admin update round timing/access settings

Validate:

* roundKey known
* numeric values positive
* status enum correct
* `endTime > startTime`
* `playWindowEnd > playWindowStart`

---

## C. New / Updated Endpoints

### Public / team endpoints

#### 1. Competition Lobby Config

```http
GET /competition/rounds
```

Response should include:

* `generalRules`
* round list with:

  * `roundKey`
  * `roundName`
  * `status`
  * `underConstruction`
  * `enabled`
  * `startTime`
  * `endTime`
  * `playWindowStart`
  * `playWindowEnd`
  * `rules`
  * `canEnter`
  * optional `availabilityLabel`

---

#### 2. Create / Get Session

```http
POST /game/session
```

Body:

```json
{
  "teamName": "Team Alpha",
  "roundKey": "round1"
}
```

Behavior:

* if active session exists for same team and round, return it
* else create one
* but only if round is currently allowed for play

---

#### 3. Get Questions by Round + Level

Keep consistent endpoint, preferably:

```http
GET /questions/by-level?roundKey=round1&level=1
```

Recommended strategy:

* frontend fetches level list once
* caches locally
* chooses next question from cache
* backend still validates answers by question ID

---

#### 4. Submit Answer

Existing endpoint remains but must:

* validate session is active
* validate question belongs to session round
* update `maxLevelReached` correctly

---

#### 5. End Session

When ending:

* mark status completed / timeout
* finalize only once
* aggregate into `team.roundStats[roundKey]`

If already finalized:

* return final state without duplicate aggregation

---

### Admin endpoints

#### 1. Get round configs

```http
GET /admin/config/rounds
```

Must include:

* `generalRules`
* full round config including play windows

---

#### 2. Update specific round

```http
PUT /admin/config/rounds/:roundKey
```

Must support:

* enabled
* status
* underConstruction
* startTime
* endTime
* playWindowStart
* playWindowEnd
* totalGameTimeSeconds
* questionTimeoutSeconds
* pointsPerCorrect
* maxLevel
* maxConsecutiveWrong
* leaderboardEnabled
* rules

---

#### 3. Optional general rules endpoint

If useful:

```http
PUT /admin/config/general-rules
```

If not added, include general rules update in the existing config endpoint structure.

---

#### 4. Get leaderboard

```http
GET /admin/leaderboard?roundKey=round1
```

Response fields:

* rank
* teamName
* maxLevelReached
* totalPoints
* bestPoints
* sessionsPlayed

---

## D. Update Services

### 1. `GameService`

Must:

* get round config
* validate round availability
* validate play access window
* create/reuse session
* fetch questions efficiently
* update `maxLevelReached`
* finalize session idempotently

### 2. `QuestionsService`

Must support:

* filtering by roundKey
* filtering by level
* only active questions
* efficient querying

### 3. `TeamsService`

Must support:

* updating round stats
* retrieving leaderboard sorted by round-aware fields
* compatibility with older fields

### 4. `AdminService`

Must support:

* round config retrieval/update
* general rules retrieval/update
* round-specific leaderboard
* competition summary stats
* correct round status/access-state calculations if needed

### 5. `CompetitionService` or controller logic

Must return lobby-ready data:

* general rules
* rounds
* access state
* canEnter

---

## E. Business Logic Requirements

### Session creation rules

* team must exist
* team must be active
* round must exist
* round must be enabled
* round must not be under construction
* current time must be within valid play access window
* if active session already exists for team+round, return it

### Leaderboard stats update rules

When session finalizes:

* increment `sessionsPlayed`
* add to `totalPoints`
* update `bestPoints` if higher
* update `maxLevelReached` if higher

Only once.

### Max level logic

* session `maxLevelReached` must preserve peak reached
* demotion must not reduce peak max level reached
* aggregate max level must preserve highest-ever level for that round

### Availability logic

A round is playable only if:

* enabled
* not under construction
* status allows play
* within play window

This must be enforced in backend and reflected in frontend.

---

# Detailed Frontend Changes

---

## 1. Update Competition Lobby Page

Use or update:

* `frontend/src/pages/CompetitionLobby.tsx`

### It should:

* load team info from storage/state
* fetch `/competition/rounds`
* render round cards
* render a dedicated **General Rules** section below the round cards
* display polished timing and access state information

### Round card contents

* round name
* short description if available
* rules list
* display timings
* play access timing
* status badge
* CTA button

### Button logic

* if `canEnter` true → enabled
* else disabled with appropriate label

### General Rules section

Show:

* title
* rules list from backend config
* visually separate block below the 2 round divs/cards

---

## 2. Update Team Login Flow

After successful team login:

* keep redirect to `/competition`
* do not auto-start a session
* session only starts when team clicks Enter on a playable round

---

## 3. Update Round1 Component

Ensure current Round1 component:

* remains round-aware
* creates/reuses session with `roundKey=round1`
* respects backend-controlled timing/access logic
* uses DB-backed question loading
* keeps local per-level question cache
* avoids repeated API calls on rerender

Suggested cache:

```ts
Record<number, Question[]>
```

Ensure:

* stable `useEffect` dependencies
* timer cleanup
* no infinite loops
* no duplicate session creation calls

---

## 4. Keep Round 2 Placeholder Page

`frontend/src/pages/Round2ComingSoon.tsx` should:

* remain polished
* show under construction
* allow back navigation to lobby

---

## 5. Update Admin Dashboard Pages

Likely:

* `Dashboard.tsx`
* `Leaderboard.tsx`
* `GameConfig.tsx` or Round Config page

### `GameConfig.tsx`

Must support:

* general rules editor
* per-round timing editor
* per-round play access window editor
* rules editor
* validation feedback
* save actions

### `Leaderboard.tsx`

Must be reviewed and corrected if needed to show:

* Rank
* Team Name
* Max Level Reached
* Total Points
* Best Points
* Sessions Played

Also verify:

* sorting matches backend
* selected round handling works
* polling interval and cleanup are correct

### `Dashboard.tsx`

Add / verify:

* round status summary cards
* play window summary
* highest level reached
* average points
* teams participated
* active sessions

---

# Scalability / Performance Requirements

These are mandatory.

---

## 1. Reduce unnecessary frontend API calls

Must do:

* fetch lobby data once on page load
* no repeated config/rules calls on rerender
* cache question lists per level
* no repeated session creation calls
* no duplicate leaderboard intervals

---

## 2. Improve backend efficiency

Must do:

* use indexes
* fetch only needed leaderboard fields
* avoid loading unnecessary large docs
* avoid re-aggregating finalized sessions

---

## 3. Idempotent session finalization

Mandatory:

* ending the same session multiple times must not duplicate stats
* use `isFinalized`

---

## 4. Safe timer handling on frontend

Ensure:

* question timer cleanup works
* total game timer cleanup works
* navigating away does not leak intervals
* remounting does not duplicate timers

---

# Suggested File-Level Changes

Adjust exact file paths if needed, but keep architecture clean.

---

## Backend likely files to modify

* `backend/src/schemas/question.schema.ts`

* `backend/src/schemas/game-session.schema.ts`

* `backend/src/schemas/team.schema.ts`

* `backend/src/schemas/game-config.schema.ts`

* `backend/src/game/game.controller.ts`

* `backend/src/game/game.service.ts`

* `backend/src/questions/questions.controller.ts`

* `backend/src/questions/questions.service.ts`

* `backend/src/teams/teams.service.ts`

* `backend/src/teams/teams.controller.ts`

* `backend/src/admin/admin.controller.ts`

* `backend/src/admin/admin.service.ts`

* competition controller / service

* DTO files

* seed/config initialization script if needed

### Likely new helper files

* DTO for round config update
* DTO for lobby/general rules response
* helper for round availability computation
* utility for session finalization / aggregate update

---

## Frontend likely files to modify

* `frontend/src/App.tsx`
* `frontend/src/components/Round1.tsx`
* `frontend/src/pages/TeamLogin.tsx`
* `frontend/src/pages/CompetitionLobby.tsx`
* `frontend/src/pages/admin/Dashboard.tsx`
* `frontend/src/pages/admin/Leaderboard.tsx`
* `frontend/src/pages/admin/GameConfig.tsx`
* `frontend/src/api/axios.ts`

### Optional new files

* `frontend/src/types/competition.ts`
* `frontend/src/hooks/useCompetitionConfig.ts`
* `frontend/src/hooks/useQuestionCache.ts`

---

# UX Expectations

## Competition lobby

Must feel polished:

* clean card layout
* clear round status
* clean rules presentation
* clear timing/access display
* responsive design
* clear general rules section below round cards

## Admin UI

Must feel like a real control panel:

* easy round timing edits
* clear access-window editing
* strong leaderboard visibility
* clean validation feedback

## Game UI

Must remain smooth:

* no flicker from repeated loads
* no lag from unnecessary requests

---

# Backward Compatibility

Do not break existing system behavior unnecessarily.

### Preserve

* existing admin login
* existing team login credentials
* existing questions
* existing Round 1 gameplay
* existing seeded data
* existing round-aware architecture

### Migration approach

If older docs/data do not have new fields:

* apply safe defaults
* ensure service logic handles missing `generalRules`
* ensure missing `playWindowStart/playWindowEnd` fail gracefully
* ensure older questions default to `roundKey = "round1"`

---

# Testing Requirements

Claude must implement and verify all of the following.

---

## A. Team Flow

1. Team logs in successfully
2. Team lands on competition lobby
3. Lobby shows Round 1 and Round 2
4. Lobby shows General Rules section below the round cards
5. Round 1 is enterable only when allowed by admin-configured play window
6. Round 2 shows under construction and is not enterable
7. Clicking Round 1 starts or resumes only one active session
8. Gameplay works fully

---

## B. Round Config / Rules

1. Admin can view round configs
2. Admin can update Round 1 timings/settings
3. Admin can update Round 1 play access window
4. Admin can update general lobby rules
5. Admin can mark Round 2 under construction
6. Validation works on invalid timing ranges
7. Updated config is reflected in competition lobby

---

## C. Round 1 Gameplay

1. Questions come from DB
2. Questions are filtered by `roundKey + level`
3. Same level data is not fetched repeatedly without need
4. Max level reached is tracked correctly
5. Team can level up correctly
6. Demotion logic still works
7. Peak max level remains preserved even after demotion
8. Ending session finalizes only once

---

## D. Leaderboard

1. Leaderboard ranking is based on:

   * highest max level reached
   * then highest total points
   * then best points
2. Admin leaderboard displays correct columns
3. Teams with same max level are sorted by points
4. Stats reflect finalized sessions only
5. Admin leaderboard implementation is reviewed and fixed if inconsistent

---

## E. Edge Cases

1. Team attempts to enter disabled round
2. Team attempts to enter under-construction round
3. Team attempts to enter round before play window opens
4. Team attempts to enter round after play window closes
5. Team attempts to create second active session for same round
6. Team reloads page mid-session
7. Session end endpoint called twice
8. Old team documents without `roundStats`
9. Old config without `generalRules`
10. Old config without explicit play window fields
11. Old question documents without `roundKey`

---

# Acceptance Criteria

The work is only complete when all of the following are true:

1. Team lands on competition lobby after login.
2. Lobby shows at least two round cards: Round 1 and Round 2.
3. Lobby shows a dedicated General Rules section below the round cards.
4. Admin can configure round timings/settings from dashboard.
5. Admin can configure when each round is actually playable.
6. Lobby correctly enables/disables round entry based on configured timing/access window.
7. Round 1 can be entered and played when allowed.
8. Round 2 remains visible and under construction.
9. Round 1 questions are loaded from database properly.
10. Frontend avoids wasteful repeated API calls.
11. Round-specific leaderboard is ranked by:

    * max level reached
    * total points
    * best points
12. Admin leaderboard shows this correctly and professionally.
13. Session aggregation is idempotent and does not double-count.
14. Team stats remain stored in a scalable round-aware structure.
15. Existing functionality is not broken.

---

# Implementation Notes

## Strong recommendation

Do not implement this as hacks on top of the existing structure.

Refactor cleanly where needed so that:

* rounds remain first-class entities
* sessions remain round-aware
* leaderboard remains round-aware
* questions remain round-aware
* admin config remains round-aware
* general rules become first-class config data
* round play access timing is enforced consistently across lobby and backend

## Also important

Keep code production-quality:

* clean naming
* DTO validation
* no duplicated logic
* safe error handling
* clean React state management
* clean NestJS service layering

---

# Final Instruction to Claude

Implement this as a **complete, working enhancement**, not partial scaffolding.

Do not leave TODO placeholders for critical paths.

The final result must behave like a real multi-round competition platform where:

* teams first choose a competition round
* the lobby includes a proper General Rules section
* admin controls round timings and play access window
* round availability is enforced safely in backend and reflected in frontend
* Round 1 is fully working
* Round 2 is visibly under construction
* leaderboard is based on max level and points
* admin leaderboard is reviewed and corrected if needed
* DB-backed question loading is efficient and scalable

If any internal restructuring is needed to make this robust, do it cleanly.
