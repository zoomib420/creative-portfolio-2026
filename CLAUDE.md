# CLAUDE.md

This project's full guidance for AI agents lives in **[AGENTS.md](./AGENTS.md)** — read it first.

Quick pointers:

- **What the human still must do** (real data, keys, deploy): [docs/USER_TODO.md](./docs/USER_TODO.md)
- **Architecture & rules**: [AGENTS.md](./AGENTS.md)
- **Task board** (pick work here): [docs/AI_TASKS.md](./docs/AI_TASKS.md)
- **Technical architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Roadmap / phases**: [docs/ROADMAP.md](./docs/ROADMAP.md)
- **Design / vibe**: [docs/DESIGN.md](./docs/DESIGN.md)
- **Content to fill in**: [docs/CONTENT.md](./docs/CONTENT.md)

Non-negotiables (full list in AGENTS.md §3):

1. Every 3D feature needs a 2D fallback. Never a blank screen.
2. Secret API keys are server-side only — never imported in `src/`.
3. `npm run build` must pass before claiming a task is done.
4. The 3D bundle stays code-split (`lazy()`); the `basic` tier must not download it.
