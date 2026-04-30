## Plan

Two small updates to `index.html` and one asset replacement.

### 1. Update meta title
Change all title tags from "Caché Life" to "CACHÉ LIFE" (uppercase):
- `<title>`
- `<meta property="og:title">`
- `<meta name="twitter:title">`

### 2. Replace og:image
Copy the newly uploaded logo (`user-uploads://IMG_2555.png`) to `public/og-image.png`, overwriting the existing one. The existing `<meta property="og:image">` and `<meta name="twitter:image">` tags already point to `/og-image.png`, so no markup change needed there.

### Files affected
- `index.html` — title text updates
- `public/og-image.png` — replaced with new uploaded logo