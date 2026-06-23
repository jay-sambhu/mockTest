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

### Vercel
1. Push the repository to GitHub.
2. In Vercel, import the GitHub repository.
3. Set the following Environment Variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – your Supabase anon key
   - `DATABASE_URL` – direct PostgreSQL connection string (e.g., from Supabase)
4. Vercel will automatically detect the `vercel.json` and use the Next.js build.
5. After deployment, the site will be live at the generated Vercel URL.

### Railway (optional)
1. Create a new Railway project and link the repository.
2. Add the same environment variables as above.
3. Railway will run `npm install && npm run build` and start the app.

After deployment, ensure the site loads correctly and analytics fire as expected.


Deploy to Vercel or Railway with your Supabase `DATABASE_URL` and `DIRECT_URL` environment variables configured.
