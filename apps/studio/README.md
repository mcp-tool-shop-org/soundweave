# @soundweave/studio

The Studio app is the primary authoring surface for Soundweave packs. It provides a dark-themed control surface for creating, editing, and inspecting every entity in a pack.

## Screens

| Screen | Purpose |
|--------|---------|
| **Project** | Pack metadata, stats overview, unused entity detection |
| **Assets** | CRUD for audio assets (music, sfx, ambience, stinger, voice) |
| **Stems** | CRUD for stems with asset assignment and role tagging |
| **Scenes** | CRUD for scenes with inline layer editing (add/remove/reorder) |
| **Bindings** | CRUD for bindings with inline condition editing |
| **Transitions** | CRUD for transitions with mode-specific validation warnings |
| **Review** | Live validation findings from `@soundweave/review`, grouped by severity |

## Development

```bash
pnpm --filter @soundweave/studio dev    # Next.js dev server
pnpm --filter @soundweave/studio build  # Production build
pnpm --filter @soundweave/studio test   # Run tests (45 tests)
```

## Stack

- **Framework:** Next.js 15 (App Router)
- **State:** Zustand
- **Validation:** `@soundweave/review` (derived via `useReview` hook)
- **Testing:** Vitest + Testing Library + jsdom
- **Styling:** CSS variables, dark theme (no CSS-in-JS)
