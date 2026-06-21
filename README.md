# QuizCraft Frontend

A Vite + React + TypeScript + Tailwind CSS frontend for the FastAPI quiz app.

## Stack
- **Vite** — build tool & dev server
- **React + TypeScript** — UI  
- **Tailwind CSS v4** — styling
- **TanStack Query v5** — data fetching & caching
- **Lucide React** — icons
- **Axios** — HTTP client

## Setup

```bash
npm install
npm run dev        # dev server at localhost:5173
npm run build      # production build
```

## Backend

Run your FastAPI app on port 8000:
```bash
uv run uvicorn main:app --reload
```

The Vite dev server proxies `/api/*` → `http://localhost:8000/*`.

## Features

**Manage tab** — create, edit, delete questions and choices  
**Play Quiz tab** — sequential quiz mode with scoring and results screen
