# ClassWars: Round 1 - Frontend Complete Documentation

## Project Overview
**ClassWars: Round 1** is a tactical, themed quiz game designed as an OOP (Object-Oriented Programming) knowledge assessment tool. It presents itself as a cybersecurity/tactical gameplay experience with a "hacker briefing" aesthetic, featuring green terminal styling, tactical HUD elements, radar systems, and CRT monitor effects.

The application is built with:
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.14
- **Animation**: Motion/Framer Motion for React
- **Icons**: Lucide React Icons
- **UI Theme**: Retro tactical/cyberpunk green-on-black terminal aesthetic

---

## File Structure

```
src/
├── App.tsx                    # Root component with error boundary
├── main.tsx                   # React DOM entry point
├── index.css                  # Global styles and Tailwind configuration
├── components/
│   ├── Round1.tsx            # Main game component (95% of game logic)
│   ├── MatrixBackground.tsx  # Matrix rain effect background
│   └── TacticalBackground.tsx # Advanced tactical HUD background
└── data/
    └── questions.ts          # Question bank with 25 OOP questions across 5 levels
```

---

## Core Components

### 1. **App.tsx** - Root Component with Error Handling
**Purpose**: Wraps the entire application with an ErrorBoundary component.

**Key Features**:
- **ErrorBoundary Class Component**: Catches React errors and displays them in a styled error screen (monospace, dark background, red text)
- Logs component errors to console
- Shows both error message and stack trace to user for debugging

**Structure**:
```
App (ErrorBoundary)
└── Round1 (Main Game Component)
```

---

### 2. **Round1.tsx** - Main Game Component (Core Logic)
**Purpose**: Orchestrates the entire game experience, including game states, question selection, answer validation, progression logic, and UI rendering.

**Game States**:
1. **Briefing Screen** - Initial narrative briefing with typewriter effect
2. **Main Game** - Active gameplay with question, timer, and input
3. **Game Over** - Final results screen showing stats

**Key State Variables**:

```typescript
// Game progression
- hasStarted: boolean          // Whether game has begun
- showBriefing: boolean        // Show briefing screen
- briefingFinished: boolean    // Briefing typewriter complete
- level: number                // Current security level (1-5+)
- points: number               // Total intel points earned
- correctInLevel: number       // Correct answers in current level
- consecutiveWrong: number     // Wrong answers in a row (0-2)

// Time tracking
- timeLeft: number             // Time remaining for current question (60 seconds)
- totalTime: number            // Total session time (3600 seconds = 1 hour)

// Current question
- currentQuestion: Question    // Current question object
- answerInput: string          // User's text input answer
- selectedOption: string       // User's selected MCQ option
- feedback: { message, type }  // Feedback message (success/error/warning)
- gameOver: boolean            // Game ended
- showQuitModal: boolean       // Disconnect confirmation modal
```

**Briefing Text**:
A narrative briefing framed as a military operation:
- Mission: Extract intel from Vladimir Makarov's mainframe
- Time limit: 1 hour
- Scoring: +5 points per correct answer
- Level progression: Answer [current level] questions to advance
- Strike system: 2 consecutive wrongs = level demotion

**SessionStorage Usage**:
- `hasSeenBriefing_v2`: Persists briefing completion across page refreshes
- Users only see briefing once per session

**Key Functions**:

#### `pickQuestion(targetLevel: number)`
- Randomly selects a question from the question bank at specified level
- Falls back to max available level if requested level doesn't exist
- Resets question timer (60 seconds), answer input, and feedback when called

#### `checkAnswer(q: Question, ans: string) => boolean`
- MCQ: Exact string match with correct answer
- Text/Code: Case-insensitive, ignores whitespace and trailing semicolons
- Normalizes input: removes spaces, converts to lowercase, strips semicolons

#### `handleSubmit()`
- Validates answer based on question type
- **Correct Answer**:
  - +5 points
  - Increment correctInLevel counter
  - If correctInLevel >= level: advance to next level, reset counters, show success feedback
  - Otherwise: load new question at same level with success feedback
  - Reset consecutiveWrong to 0
  
- **Incorrect Answer**:
  - Increment consecutiveWrong counter
  - If consecutiveWrong >= 2: demote to max(1, level-1), reset counters, show error feedback
  - Otherwise: show error feedback with strike count (1/2 or 2/2)
  - Load new question at same level

#### `handleTimeout()`
- Triggers when timeLeft reaches 0
- Shows warning feedback: "CONNECTION TIMEOUT: DEFENSE MEASURE RECONFIGURED"
- After 2 seconds, loads next question (no points lost, no strike)

#### `formatTime(seconds: number) => string`
- Converts seconds to MM:SS format with zero-padding

**Typewriter Text Component**:
- Animates text character-by-character with blinking cursor
- Used for briefing narrative
- Calls `onComplete()` when finished typing
- Customizable typing speed (default 45ms per character)
- Prevents double-typing in React StrictMode by using substring

**HUD Corners Component**:
- Renders four corner brackets (tactical HUD styling)
- Displays "REC" indicator (red pulsing circle) at top-right
- Shows "CAM-04 // SAT-LINK SECURE" label at bottom-left
- Used on briefing, feedback, and quit modal screens

**Briefing Screen Layout**:
- Full-screen dark background with tactical background effects
- Title with target icon
- Long-form briefing text with typewriter animation
- "INITIATE BREACH" button (only appears after typewriter completes)
- Styled with semi-transparent backdrop, green glow, and decorative corners

**Main Game Interface Layout**:
```
┌─────────────────────────────────────────────┐
│ Top Bar (Title, Time, Power Button)         │
├─────────────────────────────────────────────┤
│ Telemetry (Level, Points, Progress, Strikes)│
├─────────────────────────────────────────────┤
│                                             │
│  Current Question Display                  │
│  - Question Type Badge                      │
│  - Question Text                            │
│  - Code Block (if applicable)              │
│  - Input Section (MCQ options or text input)│
│  - Local Timer (flashing red if < 10 sec)  │
│  - Submit Button                            │
│                                             │
└─────────────────────────────────────────────┘
```

**Game Flow**:
1. User sees briefing with narrative context
2. Press "INITIATE BREACH" button to start
3. Question loads with 60-second timer
4. User answers (MCQ selection or text input)
5. Feedback overlay shows result (success/error/warning)
6. After feedback delay, next question loads
7. Progress tracked via level, points, and strikes
8. When totalTime reaches 0, gameOver = true → show results screen
9. User can quit anytime (press Power button) → confirmation modal

**Timer Logic**:
- Global `totalTime` counts down during active gameplay
- Local `timeLeft` resets per question (60 seconds)
- When timeLeft hits 0, `handleTimeout()` fires
- When totalTime hits 0, game ends
- Timers pause when: feedback visible, quit modal open, or game over

**Responsive Design**:
- Mobile-first: max-width 5xl container
- Tablet/desktop: larger fonts, grid columns adjusted
- Padding and gaps scale with breakpoints (md: prefix)
- Hidden elements on mobile (e.g., "[VIEW BRIEFING]" button)

**Styling Classes**:
- `.scanlines`: CRT scanline effect via ::before pseudo-element
- `.crt-flicker`: Opacity animation for CRT monitor flicker
- `.text-glow`: Green text shadow glow effect
- `.text-glow-red`: Red text shadow glow effect
- Colors: Green `#39ff14` on black `#020502`
- Borders: 2-4px neon green with rgba transparency
- Shadows: Colored box-shadows for neon effects (rgba)

---

### 3. **MatrixBackground.tsx** - Matrix Rain Effect
**Purpose**: Full-screen animated background resembling The Matrix movie.

**Technical Details**:
- **Canvas-based animation** with requestAnimationFrame (~30 FPS)
- **Characters**: Latin alphabet, numbers, symbols, and Japanese Katakana
- **Effect**: Characters "rain" down columns with randomized speeds
- **Coloring**: Mostly green (#0f0), with occasional white leading characters
- **Glow Effect**: White characters have green box-shadow glow

**Algorithm**:
1. Create `drops` array tracking Y position of each column
2. Each frame, fill screen with semi-transparent black (trail effect)
3. For each column, draw random character at current Y position
4. 20% chance of "head" character (white with glow) vs regular green
5. Increment Y position for next frame
6. When character falls off-screen, reset to top with 2.5% probability

**Performance**:
- Semi-transparent fillRect creates motion blur effect
- Fixed font size (16px) determines grid resolution
- Responsive to window resize events
- Opacity set to 0.4 when overlaid on page content

**Used In**: Could be background for entire app, but currently only TacticalBackground is shown.

---

### 4. **TacticalBackground.tsx** - Advanced Tactical HUD Background
**Purpose**: Complex canvas animation creating a military/tactical command center aesthetic.

**Technical Details**:
- **Canvas-based animation** with requestAnimationFrame
- **Multiple visual layers**:
  1. Hex grid overlay (very subtle, low opacity)
  2. Rectangular grid (100px spacing)
  3. Center crosshairs (dashed lines with gaps)
  4. Radar system (concentric circles, compass, rotating sweep)
  5. Tactical blips (red moving targets with expanding rings)
  6. Reticles (green cross-hair squares tracking targets)
  7. Data stream (scrolling text on left/right sides with coordinates and status)

**Components**:

#### **drawHexGrid()**
- Creates hexagonal grid pattern
- Uses trigonometry for hex positioning
- Opacity: 0.03 (nearly invisible)
- Hex size: 30px

#### **drawGrid()**
- Rectangular grid with 100px spacing
- Center crosshairs with dashed pattern
- Green color with low opacity (0.08-0.2)

#### **drawRadar()**
- Concentric circles (5 rings)
- Compass labels (N, S, E, W)
- Rotating sweep animation using conic gradient
- Sweep rotates continuously at speed 0.015 radians per frame
- Leading edge line always visible

#### **drawBlips()**
- Red moving targets appear randomly in radar (5% chance per frame, max 12 blips)
- Each blip has:
  - Position in radar area
  - Life span (150 frames)
  - Random angle and speed
  - Expanding ring effect (grows as blip fades)
  - Red glow shadow effect
  - "TGT-{id}" label below each blip
- Blips fade out (opacity = life/maxLife)
- Removed when life <= 0

#### **drawReticles()**
- 3 permanent green targeting crosshairs
- Smooth tracking: moves 5% toward target per frame
- When within 5px of target, picks new random target
- Reticles are UI elements, not affecting gameplay

#### **drawDataStream()**
- Scrolling text on left and right sides
- Left side: Track IDs with coordinates (LAT, LON, ALT)
- Right side: System checksums with OK/WARN status
- Status in red if WARN, green if OK
- Text appears to scroll based on time (animation driven by Date.now())
- Creates illusion of live data stream

**Performance Optimization**:
- Semi-transparent fillRect creates smooth trails (not complete clear)
- All animations use requestAnimationFrame (browser-optimized)
- No memory leaks: proper cleanup in useEffect return

**Responsive Canvas**:
- Canvas resizes with window.resize event
- All coordinates recalculated for new dimensions
- Maintains aspect ratio and visual balance

---

## Data Structure

### **questions.ts** - Question Bank

**Question Interface**:
```typescript
interface Question {
  id: number;           // Unique question ID (1-25)
  level: number;        // Difficulty level (1-5)
  type: QuestionType;   // 'oneword' | 'code' | 'mcq'
  text: string;         // Question prompt (riddle-like)
  code?: string;        // Code snippet (for 'code' type)
  options?: string[];   // MCQ options (for 'mcq' type)
  correct: string;      // Correct answer
}
```

**Question Types**:
1. **'oneword'**: Single-word answer (e.g., "Encapsulation") with fuzzy matching
2. **'code'**: Code correction task with code snippet shown, syntax matching answer
3. **'mcq'**: Multiple choice with 4 options, exact string matching

**Riddle Format**:
- Questions presented as cryptic clues/riddles about OOP concepts
- Examples:
  - "I keep my information locked away..." → "Encapsulation"
  - "A child may inherit traits..." → "Inheritance"
  - "You call my name the same way..." → "Polymorphism"

**Question Bank Structure** (25 questions across 5 levels):

- **Level 1** (IDs 1-5): Basic OOP concepts (Encapsulation, Inheritance, Polymorphism, Abstraction, Access Specifiers)
  - Mix of oneword (4) and mcq (1)

- **Level 2** (IDs 6-10): Constructors & Destructors
  - Mix of oneword (2), mcq (3)

- **Level 3** (IDs 11-15): Advanced concepts & syntax
  - Oneword (2), code (3)
  - Code includes mistakes in variable assignment, constructor calls, class syntax

- **Level 4** (IDs 16-20): Output prediction & memory
  - Mcq (5)
  - Covers polymorphism behavior, copy constructors, dynamic memory, abstract classes, virtual destructors

- **Level 5** (IDs 21-25): Patterns & deep knowledge
  - Oneword (2), mcq (3)
  - Covers Singleton, Polymorphism, Encapsulation, Inheritance, advanced concepts

---

## Game Mechanics

### **Progression System**
```
Level 1 (Need 1 correct) → Level 2 (Need 2 correct) → ... → Level 5+ (Need 5 correct)
```

- To advance from Level N to N+1: Answer N questions correctly consecutively
- Each level can have multiple questions; players cycle through until quota met

### **Strike System**
- 2 consecutive wrong answers trigger demotion
- Correct answer resets strike counter to 0
- Timeouts don't count as strikes; just reload question

### **Scoring**
- +5 points per correct answer
- No points for timeouts (but no strike either)
- No points for wrong answers
- Final score = (number of correct answers) × 5

### **Time Management**
- Global session: 1 hour (3600 seconds)
- Per question: 60 seconds
- Timeouts on question auto-reload without penalty
- When global time runs out, game ends immediately

### **Answer Validation**
- **MCQ**: Exact string match (case-sensitive)
  - Options formatted as "A) Option", "B) Option", etc.
  - User must select exact text

- **Oneword**: Fuzzy matching
  - Normalize: lowercase, remove spaces, remove trailing semicolons
  - Compare normalized versions
  - Examples: "Encapsulation", " encapsulation ", "ENCAPSULATION;", "encapsulation" all match

- **Code**: Fuzzy matching
  - Same normalization as oneword
  - Used for fixing syntax errors in code snippets

---

## UI/UX Design

### **Visual Theme**
- **Color Palette**:
  - Background: Nearly black (#020502, #001a00, #001100)
  - Primary: Neon green (#39ff14)
  - Secondary: Red (#ff3232) for errors/warnings
  - Text: White for emphasis, green for primary info
  
- **Typography**:
  - Font: Monospace (Courier New, SFMono fallback)
  - All caps for headings and labels
  - Tracking/letter-spacing for cyberpunk aesthetic
  
- **Effects**:
  - CRT scanlines (pseudo-element with linear gradients)
  - Flicker animation (opacity 95%-100% at 150ms interval)
  - Glow text shadows (green or red)
  - Box shadows for neon borders
  - Blur and backdrop-filter for glass morphism

### **Responsive Layout**
- Mobile-first approach
- Breakpoint: `md:` (768px)
- Flex layouts with gap scaling
- Text size scaling for readability
- Hidden elements adjusted per viewport
- Grid columns adjust: 2 on mobile → 4 on desktop

### **Animations**
- **Motion Library**: Framer Motion (motion/react)
- **Usage**:
  - Fade-in/slide-in for questions: `initial opacity:0`, `animate opacity:1, x:0`
  - Pulse effects: `.animate-pulse` on glow elements
  - Spin effects: icon spins on hover

### **Modal Windows**
- **Briefing Modal**: Full-screen overlay with typewriter narrative
- **Feedback Modal**: Centered overlay during answer evaluation (success/error/warning)
- **Quit Modal**: Confirmation dialog for disconnecting

---

## Technical Implementation Details

### **React Hooks Usage**
```typescript
- useState: Game state management (level, points, feedback, etc.)
- useEffect: Timers, question selection, initialization
- useCallback: pickQuestion memoization to prevent unnecessary re-renders
- useRef: TypewriterText memoization of callback, canvas refs
```

### **Error Handling**
- ErrorBoundary catches React rendering errors
- SessionStorage wrapped in try-catch for privacy mode
- Graceful degradation if canvas not supported

### **Props & Composition**
- TypewriterText: Pure functional component, decoupled from game logic
- HudCorners: Pure decorative component, reused across screens
- Main state management: All in Round1 component (not lifted to App)
- No prop drilling beyond component boundaries

### **Performance Considerations**
- Canvas animations use requestAnimationFrame (browser-optimized)
- Timer intervals at 1000ms (once per second)
- Debounced window resize with useEffect cleanup
- Mutable refs prevent unnecessary re-renders of Typewriter
- Motion animations hardware-accelerated

### **Browser APIs Used**
- SessionStorage: Briefing persistence
- Canvas 2D Context: Background animations
- requestAnimationFrame: Smooth 60fps rendering
- setInterval/setTimeout: Game timers
- Math.random: Question selection, animation randomization

---

## Game Flow Diagram

```
START
  ↓
[Briefing Screen]
  ├─ Typewriter animation
  ├─ SessionStorage check
  └─ User presses "INITIATE BREACH"
    ↓
[Main Game]
  ├─ Pick question at current level
  ├─ Start 60-second timer + 1-hour global timer
  │
  ├─ [Question Display]
  │  ├─ Question text
  │  ├─ Code block (if applicable)
  │  └─ Input (MCQ or text)
  │
  ├─ User submits answer
  │
  ├─ [Feedback Overlay]
  │  ├─ Success? Points +5, progress tracking
  │  └─ Error? Strike counter, demotion logic
  │
  └─ [Repeat until global timer runs out]
    ↓
[Game Over Screen]
  └─ Show level, points, time elapsed
```

---

## Code Quality & Best Practices

1. **TypeScript**: Full type safety with Question interface
2. **Accessibility**: Semantic HTML, alt text on buttons, focus states
3. **Performance**: Memoized callbacks, efficient canvas rendering, proper cleanup
4. **Code Organization**: Clear separation of concerns (components, data, styling)
5. **Error Boundaries**: Graceful error handling for unexpected issues
6. **Responsive Design**: Mobile-first, multiple breakpoints tested
7. **Comments**: Sparse but present for complex logic (timer, canvas rendering)

---

## Configuration Files

### **vite.config.ts**
- Vite dev server configuration
- React plugin enabled
- Development server on port 3000

### **tsconfig.json**
- TypeScript compiler options
- JSX: react-jsx (automatic JSX transform)
- Strict mode enabled
- Module resolution: bundler

### **tailwind.config.js** (via @tailwindcss/vite)
- Utility-first CSS framework
- Custom colors defined inline in className (e.g., `text-[#39ff14]`)
- Custom animations (.animate-pulse in CSS)

### **package.json**
- Dependencies: React 19, Vite 6.2, Tailwind 4.1, Motion, Lucide icons
- DevDependencies: TypeScript, Autoprefixer, tsx
- Scripts: `npm run dev` (development), `npm run build` (production)

---

## Deployment & Running

**Development**:
```bash
npm install
npm run dev
# Server runs on http://localhost:3000
```

**Production**:
```bash
npm run build
# Creates optimized dist/ folder
```

---

## Summary

ClassWars: Round 1 is a full-featured React quiz application with:
- **Dynamic question system** with 5 difficulty levels
- **Real-time game state management** with scoring/progression
- **Cyberpunk/tactical visual theme** with canvas animations
- **Responsive mobile-friendly design**
- **Multiple question types** (MCQ, code correction, single-word riddles)
- **Time pressure mechanics** (60s per question, 1-hour session)
- **Strike-based demotion system** for difficulty progression
- **Immersive narrative framing** as tactical military operation

The entire game runs client-side in the browser with no backend requirements. All state persists in React component state with optional SessionStorage for briefing persistence.
