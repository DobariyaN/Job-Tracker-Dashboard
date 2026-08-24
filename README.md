# Trackline — Local-First Job Application Tracker

A single-page Kanban board for tracking job applications. Everything is stored
locally in your browser via **IndexedDB** — there's no backend, no account,
and no data ever leaves your machine.

## Features

- 6-column Kanban board: Wishlist → Applied → Follow-up → Interview → Offer → Rejected
- Drag-and-drop cards between and within columns (`@dnd-kit`)
- Add / edit jobs via a slide-over form with validation (company + role required)
- Delete with a confirmation step
- Each card shows company, role, resume tag, days-since-applied, and a
  clickable LinkedIn link
- Column headers show live counts
- Search bar filters by company or role across the whole board
- Per-column sort toggle (manual drag order / newest / oldest by date applied)
- Light / dark mode (persisted, respects system preference on first visit)
- Export all data to a JSON backup file, and import it back in later
- All CRUD operations write straight to IndexedDB — refresh-proof, persists
  across sessions

## Tech stack

- React 19 + Vite
- Tailwind CSS
- `idb` (IndexedDB wrapper)
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop
- `lucide-react` for icons

No backend, no API calls, no authentication — 100% client-side.

## Getting started locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## Data & privacy

All job data lives in your browser's IndexedDB, scoped to the origin you load
the app from. Clearing your browser's site data for that origin will erase
your board — use the **Export** button regularly if you want a backup, and
**Import** to restore it (on this device or a new one).

## Deploying to Vercel

You have two easy options:

### Option A — Vercel CLI (fastest, from this folder)

```bash
npm i -g vercel   # if you don't already have it
vercel             # first deploy — follow the prompts, accept the defaults
vercel --prod      # promote to your production URL
```

Vercel auto-detects this as a Vite app (build command `npm run build`, output
directory `dist`) — you shouldn't need to change any settings.

### Option B — Git + Vercel dashboard (recommended for ongoing updates)

1. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Trackline job tracker"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output directory `dist` — leave the defaults.
4. Click **Deploy**. Every future push to `main` will auto-deploy.

That's it — no environment variables or backend configuration needed, since
everything runs client-side.
