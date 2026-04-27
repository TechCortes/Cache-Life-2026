---
name: Starry Background
description: Persistent universe-like background — tiled animated GIF, fixed, matches cachelifeny.com exactly
type: design
---
The starry "universe" background is a single animated B&W starfield GIF
(`src/assets/bg/starfield.gif`, 600x848, sourced from the reference site
cachelifeny.com) tiled across the viewport with `background-repeat: repeat`,
`background-size: auto`, and `background-attachment: fixed`.

**Why:** The reference site achieves the twinkling-cosmos effect entirely via
this GIF — no JS canvas, no requestAnimationFrame. Replicating it 1:1 keeps
the look identical and removes per-frame CPU cost.

**How to apply:** Render `<StarryBackground />` once inside `Layout.tsx` at
`z-index: 0`, behind all content. Do NOT reintroduce a canvas-based starfield.
