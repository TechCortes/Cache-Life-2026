

## Goal
Move the event content (image + details) higher on the page so it sits closer to the "Scroll to explore" hint, reducing the empty gap between the hero section and the first event.

## Change (single file: `src/pages/WhatsHappening.tsx`)

The event `<section>` currently uses `min-h-[100dvh] lg:min-h-screen` with `items-center`, which vertically centers the event in a full-viewport-tall section — pushing it far below the hero.

**Edits:**

1. **Shrink the hero's bottom footprint** — reduce hero `min-h-[40vh]` to `min-h-[30vh]` and trim its `py-12` to `pt-12 pb-4` so "Scroll to explore" sits closer to the next section.

2. **Top-align the event content instead of centering it vertically** on the section:
   - Section: `items-center` → `items-start lg:items-center` (mobile pulls content up; desktop keeps centered snap behavior)
   - Reduce section top padding: `py-8 pb-12` → `pt-4 pb-12 lg:py-8`

3. **Keep desktop snap-scroll layout intact** — only mobile vertical positioning changes; the `lg:` breakpoint preserves the current centered, one-event-per-screen desktop experience.

## Visual outcome (mobile)

```text
Before                          After
┌──────────────┐                ┌──────────────┐
│  Upcoming    │                │  Upcoming    │
│  What's...   │                │  What's...   │
│  Scroll ↓    │                │  Scroll ↓    │
│              │                │  ┌────────┐  │  ← image moves up
│              │                │  │ IMAGE  │  │
│  ┌────────┐  │                │  └────────┘  │
│  │ IMAGE  │  │                │  TITLE       │
│  └────────┘  │                │  Details     │
│  TITLE       │                │  [Register]  │
└──────────────┘                └──────────────┘
```

No other pages, database, tokens, or desktop layout affected.

