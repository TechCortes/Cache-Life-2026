

## Goal
On mobile, ensure the **Register button** is always reachable when scrolling through an event on `/whats-happening`. Currently the snap-scroll container locks each event to one screen, so content below the fold (including the Register button) gets cut off and can't be reached.

## Root cause
The events container uses `h-screen overflow-y-auto snap-y snap-mandatory` with each event as `min-h-screen snap-start`. On mobile, the image + text + button exceed one viewport, but `snap-mandatory` prevents partial scrolling within an event — it forces the next snap point, hiding the button.

## Fix (single file: `src/pages/WhatsHappening.tsx`)

1. **Disable snap-scroll on mobile, keep it on desktop/tablet:**
   - Container: `snap-none lg:snap-y lg:snap-mandatory`
   - Each section: `lg:snap-start`
   - This lets mobile scroll naturally through tall content; desktop/tablet keep the polished one-event-per-screen behavior you liked.

2. **Let mobile sections grow past the viewport:**
   - Section: `min-h-[100dvh] lg:min-h-screen` (use dynamic viewport height to account for mobile browser chrome) and remove forced vertical centering on mobile (`items-start lg:items-center`) so content starts at the top and the button sits naturally below.

3. **Remove the mobile description clamp** so the full event info is readable as the user scrolls (`line-clamp-none`), and keep adequate bottom padding (`pb-12`) so the Register button isn't flush with the screen edge.

## Visual outcome

```text
Mobile (scrolls freely)        Desktop (snap, unchanged)
┌──────────────┐               ┌──────────────────────┐
│  [navbar]    │               │ ┌────┐  TITLE [Posh] │
│  ┌────────┐  │               │ │IMG │  Date · Place │
│  │ IMAGE  │  │               │ │    │  Description  │
│  └────────┘  │               │ └────┘  [Register →] │
│  TITLE       │               └──────────────────────┘
│  Date · Place│
│  Description │  ← scrolls
│  [Register →]│  ← always reachable
└──────────────┘
```

No other pages, database, or design tokens are touched.

