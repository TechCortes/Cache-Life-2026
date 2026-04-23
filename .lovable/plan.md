

## Goal
Make each event on `/whats-happening` fit fully within one viewport so the user can see the entire event (image + details + register button) without scrolling, then scroll to the next event.

## Approach
Convert the events list into a **vertical snap-scroll layout** where each event card occupies one full screen height. The image and text sit side-by-side on desktop so everything fits, and stack on mobile with constrained image height.

## Changes (single file: `src/pages/WhatsHappening.tsx`)

1. **Page header** — Make the "What's Happening" title compact (one short hero section that scrolls past), so subsequent events each get a full screen.

2. **Event card layout** — Each event becomes a full-viewport section:
   - Container: `min-h-screen w-full snap-start flex items-center` 
   - Inner card: two-column grid on desktop (`lg:grid-cols-2`), stacked on mobile
   - **Left**: image with `max-h-[80vh] object-contain` so tall flyers fit without cropping
   - **Right**: title, provider badge, date, location, description, register button — vertically centered

3. **Scroll snapping** — Wrap the events list in a `snap-y snap-mandatory` container so each scroll lands cleanly on one event.

4. **Mobile fallback** — On small screens, use `min-h-screen` with the image capped at `max-h-[55vh]` and details below, still fitting in one viewport. Description gets `line-clamp-3` on mobile if needed.

## Visual outcome

```text
┌─────────────────────────────┐
│   [Hero: What's Happening]  │  ← short intro
├─────────────────────────────┤
│ ┌──────────┐  TITLE [Posh]  │
│ │          │  Date · Place  │  ← Event 1, full viewport
│ │  IMAGE   │  Description…  │
│ │          │  [Register →]  │
│ └──────────┘                │
├─────────────────────────────┤
│ ┌──────────┐  TITLE [Posh]  │
│ │  IMAGE   │  …             │  ← Event 2, full viewport
│ └──────────┘  [Register →]  │
└─────────────────────────────┘
```

No database, styling tokens, or other pages are touched. Pure black/white aesthetic preserved.

