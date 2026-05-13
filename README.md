# vulse

> Feel the pulse of done.

A lightweight task manager with a clean card-based UI, drag-and-drop reordering, dark mode, and local-first persistence. Built with React 19, Vite 7, and Tailwind CSS 4.

## Features

- **Card layout** — Tasks displayed in a responsive Google Keep-style grid
- **Drag to reorder** — Rearrange tasks by dragging cards
- **Filter & sort** — Filter by status (all / active / completed), sort by newest, oldest, priority, or name
- **Search** — Real-time text search across all tasks
- **Priority levels** — Assign low / medium / high priority to each task
- **Due dates & categories** — Optional date picker and category labels
- **Inline editing** — Click Edit to rename a task without leaving the card
- **Undo delete** — Deleted tasks can be restored via a snackbar
- **Dark mode** — Toggle between light and dark themes
- **Data portability** — Export tasks as JSON, import from a JSON file
- **Local persistence** — All data saved to localStorage, nothing sent to a server
- **Responsive** — Works on desktop and mobile with a hamburger navigation menu

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| Vite | 7 |
| Tailwind CSS | 4 |
| React Router | 7 |

## Getting Started

```bash
# clone the repo
git clone https://github.com/shikeshjayan/vulse-task-manager-app.git
cd vulse

# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Project Structure

```
src/
  components/       Reusable UI components
    ConfirmModal.jsx
    Navbar.jsx
    Snackbar.jsx
    TaskItem.jsx
  contexts/         React context providers
    TasksProvider.jsx
    ThemeProvider.jsx
  pages/            Route-level page components
    About.jsx
    Home.jsx
    Settings.jsx
    Tasks.jsx
  App.jsx           Root component with routing
  main.jsx          Entry point
  index.css         Tailwind imports and custom animations
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

MIT
