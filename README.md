# Marion Exclusive

Enterprise e-commerce platform. Built in milestones — see the project plan for what's done and what's next.

## Milestone 1 status: project skeleton

At this point the project is a working Next.js 15 app with a placeholder home page. No database, auth, or payments yet — those come in later milestones.

## Setup (run these in order)

1. Open a terminal in this folder.
2. `npm install`
3. Copy `.env.example` to `.env` (same folder, just remove `.example` from the name).
4. `npm run dev`
5. Open `http://localhost:3000` in your browser. You should see "Marion Exclusive — Project skeleton is live."

## Pushing to GitHub

1. Create a new empty repository on GitHub (don't add a README there — this folder already has one).
2. In this folder's terminal:
   ```
   git init
   git add .
   git commit -m "Milestone 1: project skeleton"
   git branch -M main
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

## Deploying to Vercel

1. In Vercel, choose "Add New Project" and import the GitHub repo you just pushed.
2. Leave all settings as default and click Deploy.
3. Once it finishes, Vercel gives you a live URL — open it and confirm you see the same "Marion Exclusive" page you saw locally.

That live URL loading correctly is the Milestone 1 test.

## What's next (Milestone 2)

Connecting the real Supabase database and adding the actual data models (products, orders, customers, etc.), replacing the placeholder `HealthCheck` model in `prisma/schema.prisma`.
