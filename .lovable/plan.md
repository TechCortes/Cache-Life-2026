## Goal

Create a private, password-gated route at `/Afterglow` (also accessible as `/afterglow`) that hosts the Wednesdays at Nubeluz RSVP experience — separate from the public site, not linked in nav, not in sitemap.

## Architecture decision

**Approach: client-side password gate backed by a server-verified Edge Function + signed session cookie (httpOnly via short-lived JWT in localStorage fallback).**

Why not pure client-side check: a hardcoded password in JS is trivially extractable. Why not full Supabase Auth: overkill for a single shared passphrase, and the user explicitly said "private use with a password" (one shared secret), not per-user accounts.

**Chosen pattern (clean + secure + minimal surface):**
1. Password stored as a Lovable Cloud **secret** (`AFTERGLOW_ACCESS_PASSWORD`) — never shipped to the browser.
2. Edge function `verify-afterglow-access` accepts `{ password }`, compares against the secret, and on success returns a short-lived signed token (HMAC with `AFTERGLOW_SESSION_SECRET`, 7-day expiry).
3. Client stores the token in `localStorage` under `afterglow_access`. A small `useAfterglowAccess()` hook validates the token signature/expiry locally on mount (token is self-verifying because it's HMAC-signed; only the server can mint it).
4. `<AfterglowGate />` wrapper renders either the password screen or the protected content.

## Files & structure (organized, additive only)

```
src/
  features/
    afterglow/                          ← new feature folder, isolated
      AfterglowGate.tsx                 ← password screen + session check
      AfterglowPage.tsx                 ← the protected page (hero + RSVP)
      useAfterglowAccess.ts             ← hook: token state, login, logout
      access-token.ts                   ← decode/verify helpers (client side)
  pages/
    Afterglow.tsx                       ← thin route wrapper

supabase/functions/
  verify-afterglow-access/
    index.ts                            ← password check + token mint
```

- `AfterglowRSVP.tsx` (already exists, currently unused) is **moved into the feature folder** and rendered inside `AfterglowPage.tsx`. No duplication.
- Route registered in `App.tsx` for both `/Afterglow` and `/afterglow` (case-insensitive redirect).

## Privacy / SEO

- Add `Afterglow` to `public/robots.txt` as `Disallow: /afterglow` and `Disallow: /Afterglow`.
- Add `<meta name="robots" content="noindex,nofollow" />` on the page.
- **Not** added to `sitemap.xml`, **not** linked from Navbar or Footer.

## Secrets needed

1. `AFTERGLOW_ACCESS_PASSWORD` — the shared passphrase you give to guests.
2. `AFTERGLOW_SESSION_SECRET` — random 32+ byte string for HMAC signing (I'll generate and request it).

## Session UX

- Password screen: minimal, on-brand (pure black, white serif "Afterglow" lockup, single password input, "Enter" button). No nav, no footer — focused experience.
- On success: token saved, page reveals with the existing AfterglowRSVP block.
- "Sign out" link bottom-right of the protected page for shared devices.
- 7-day session; re-prompt after expiry.

## Design

Reuses every existing token (`bg-background`, serif headline, starry canvas). Zero new colors, zero new fonts. The gate screen mirrors the editorial type lockup already in `AfterglowRSVP.tsx` so it feels like one continuous experience.

## Out of scope (can follow up)

- Per-guest unique invite codes
- Rate limiting on the verify endpoint (can add IP-based throttle later)
- Email notification on RSVP (deferred — domain not set up yet)

## Steps

1. Migration: none (no schema changes).
2. Add secrets (`AFTERGLOW_ACCESS_PASSWORD`, `AFTERGLOW_SESSION_SECRET`).
3. Create edge function `verify-afterglow-access`.
4. Create `src/features/afterglow/` files + `pages/Afterglow.tsx`.
5. Register route in `App.tsx`.
6. Update `robots.txt`.
