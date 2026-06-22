# Quiz Master

A full-stack quiz platform built with Next.js, PostgreSQL, and Prisma. Create quizzes, take them with server-side scoring, and track your results.

## Features

- User registration and session-based authentication
- Create, edit, and delete quizzes with multiple-choice questions
- Take quizzes with progress tracking and instant results
- Server-side answer validation (answers never exposed to the client)
- Personal attempt history
- Responsive UI with Tailwind CSS

## Getting Started

See [SETUP.md](./SETUP.md) for full setup instructions.

```bash
npm install
./setup-db.sh
npx prisma db seed   # optional
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  app/           # Pages and API routes (App Router)
  components/    # React components
  lib/           # Auth, Prisma, helpers
  middleware.ts  # Route protection
prisma/
  schema.prisma  # Database schema
  seed.js        # Sample data
```

## Deploy

Deploy to Vercel or Railway with your Supabase `DATABASE_URL` and `DIRECT_URL` environment variables configured.
