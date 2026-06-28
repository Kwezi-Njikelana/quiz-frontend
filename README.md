# Quiznip

Quiznip is a clean quiz builder for creating questions, managing answer choices, and jumping straight into play mode. It connects to a FastAPI backend and gives you the essentials for a smooth quiz workflow: editing, validation, answer checking, scoring, and results.

## Highlights

- **Question management**: create, search, expand, edit, and delete quiz questions.
- **Flexible choices**: add two or more answer choices and mark one or more correct answers.
- **Quiz mode**: move through questions one at a time, check answers, and view final results.
- **Clean feedback**: loading skeletons, confirmation dialogs, toast messages, and inline validation.
- **Modern data flow**: TanStack Query handles fetching, caching, retries, and invalidation.

## Tech Stack

| Area | Tooling |
| --- | --- |
| App framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| HTTP client | Axios |
| Icons | Lucide React |
| Linting | ESLint |

## Getting Started

### Prerequisites

- Node.js
- npm
- A compatible FastAPI backend running on `http://localhost:8000`

### Install

```bash
npm install
```

### Run the App

```bash
npm run dev
```

The Vite dev server starts at:

```text
http://localhost:5173
```

### Backend Proxy

During development, the frontend calls API routes through `/api`. Vite proxies those requests to the backend:

```text
/api/questions       -> http://localhost:8000/questions
/api/questions/:id   -> http://localhost:8000/questions/:id
/api/choices/:id     -> http://localhost:8000/choices/:id
```

Start the backend separately, for example:

```bash
uv run uvicorn main:app --reload
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run build` | Type-check and create a production build. |
| `npm run lint` | Run ESLint across the project. |
| `npm run preview` | Preview the production build locally. |

## Project Structure

```text
src/
  api/                 Axios API client and result handling
  components/          Quiz, question, form, and shared UI components
  components/ui/       Buttons, cards, modals, toasts, skeletons, and badges
  hooks/               TanStack Query hooks for questions and choices
  pages/               Main app screen
  types/               Shared TypeScript interfaces
```

## Core API Shape

The frontend expects questions and choices in this shape:

```ts
interface Question {
  id: number;
  question_text: string;
}

interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
  question_id: number;
}
```

When creating or updating a question, the frontend sends:

```ts
{
  question_text: string;
  choices: {
    choice_text: string;
    is_correct: boolean;
  }[];
}
```

## Build

Create a production build with:

```bash
npm run build
```

Preview it locally with:

```bash
npm run preview
```

## Notes

- The app uses `staleTime: 30_000` and one retry for question queries.
- Create, update, and delete mutations invalidate the question list automatically.
- Choice data is loaded only when it is needed, such as when expanding or editing a question.
