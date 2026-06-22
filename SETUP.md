# Quiz Master — Setup Instructions

## Current Status

Core MVP is complete with authentication, quiz CRUD, server-side scoring, and attempt tracking.

## Quick Start

### 1. Environment variables

Create `.env.local` with your Supabase PostgreSQL credentials:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### 2. Sync database

```bash
./setup-db.sh
# OR manually:
npx prisma generate
npx prisma db push
```

### 3. Seed sample data (optional)

```bash
npx prisma db seed
```

Default seed account: `admin@quizapp.com` / `Password123!`

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Completed Features

### Database
- Prisma schema: User, Quiz, Question, QuestionOption, QuizAttempt, Session
- PostgreSQL via Supabase

### Authentication
- Register, login, logout with httpOnly session cookies
- Auth middleware protects `/quizzes/new`, `/quizzes/[id]/edit`, `/attempts`
- API returns 401 when authentication is required

### API Routes
- `GET/POST /api/quizzes` — list and create quizzes
- `GET/PUT/DELETE /api/quizzes/[id]` — quiz details and management
- `GET/POST /api/attempts` — submit answers (server-side scoring) and view your attempts
- `GET /api/stats` — platform statistics
- `GET /api/auth/me` — current user
- `POST /api/auth/login`, `/register`, `/logout`

### Pages
- `/` — home with stats dashboard
- `/quizzes` — browse and manage quizzes
- `/quizzes/new` — create quiz (auth required)
- `/quizzes/[id]` — take quiz
- `/quizzes/[id]/edit` — edit quiz (auth required)
- `/attempts` — your attempt history (auth required)
- `/login`, `/register`

### Security
- Correct answers are hidden from the public quiz API
- Scores are calculated on the server when submitting attempts
- Attempt history is scoped to the logged-in user

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS 4
- **UI**: React 19

## Roadmap (Not Yet Built)

- Quiz categories, search, and filtering
- Leaderboards and analytics dashboard
- Quiz sharing and embed codes
- Time limits per quiz
- Email verification and password reset
- OAuth (Google/GitHub)
- Mobile app (React Native / Expo)
- Payments and subscription tiers
