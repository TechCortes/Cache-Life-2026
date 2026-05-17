## Goal

Add a pinned, recurring "Afterglow at Nubeluz" RSVP block at the top of `/whats-happening`. It auto-computes the next Wednesday, captures RSVPs (name / email / phone) to the database, and surfaces them in the admin dashboard.

## Where it lives

`src/pages/WhatsHappening.tsx` — new `<AfterglowFeature />` section rendered immediately under the compact hero, above the mapped `events` list. It uses snap-start so it gets its own scroll panel on desktop, matching the existing event sections.

## Visual design (consistent with current aesthetic)

- Pure black background, pure white type, persistent starry canvas (already global).
- Two-column layout (image left, details right) mirroring the existing event sections for visual coherence.
- Left column: a single featured image (Nubeluz / Afterglow). Until a custom asset is provided we'll reuse `whatsHappeningTitle` styling and a placeholder; the user can drop an image later.
- Right column, top to bottom:
  - Tiny eyebrow: `WEEKLY · EVERY WEDNESDAY`
  - Display headline in serif: **Afterglow**
  - Subheadline in script/italic accent: *at Nubeluz*
  - Auto-computed date line: e.g. `Next Wednesday — Nov 19, 2026 · 10 PM`
  - One-line description (placeholder copy, easy to tweak)
  - Inline RSVP form: Name, Email, Phone, `RSVP` button
  - Microcopy: "You'll receive confirmation by email."
- Subtle one-time entrance fade/translate; no heavy motion.

## RSVP flow

- Reuses the existing `event_signups` table (already has name/email/phone + optional `posh_event_id` / `posh_url`). No schema change required.
- On submit:
  1. Client-side validate with `zod` (same pattern as `SignupForm.tsx`).
  2. Insert one row into `event_signups` with `posh_event_id = null`, `posh_url = null`, and the chosen Wednesday encoded into `name` is NOT done — instead we add a single new nullable column to record the target Wednesday cleanly (see Technical).
  3. Toast success, reset form.

## Recurrence logic

Pure client-side helper `getNextWednesday(now = new Date())`:
- Returns the upcoming Wednesday at the chosen show time (default 22:00 local).
- If today is Wednesday and current time is before show time → today; otherwise → next Wednesday.
- Formatted via `toLocaleDateString` for display; ISO string stored with the RSVP.

## Admin visibility

`src/pages/Admin.tsx` already lists `event_signups`. We'll surface the new "target Wednesday" column so the team can see which week each RSVP is for, and add a simple filter chip for "Afterglow" RSVPs (those with no `posh_event_id` and a `rsvp_for_date` set).

## Technical details

1. **Schema (one migration, additive only):**
   - `ALTER TABLE public.event_signups ADD COLUMN rsvp_for_date timestamptz NULL;`
   - `ALTER TABLE public.event_signups ADD COLUMN source text NULL;` (e.g. `'afterglow'`) — lets us cleanly distinguish recurring-night RSVPs from generic list signups.
   - No RLS change needed (existing policies already cover insert by anyone / select by authenticated).

2. **New component:** `src/components/AfterglowRSVP.tsx`
   - Self-contained: form state, zod schema, `getNextWednesday()` helper, insert into `event_signups` with `{ name, email, phone, rsvp_for_date, source: 'afterglow' }`.

3. **WhatsHappening.tsx edits:**
   - Import and render `<AfterglowRSVP />` as the first snap section after the hero.
   - Add an Event JSON-LD entry for the next Wednesday so SEO picks it up (recurring schedule).

4. **Admin.tsx edits:**
   - Show `rsvp_for_date` (formatted) and `source` columns in the signups table.
   - Optional segmented control: All / Afterglow / General.

5. **Types:** `src/integrations/supabase/types.ts` regenerates automatically after the migration is approved.

## Out of scope (can be follow-ups)

- Email confirmation to the guest (would need email infra setup).
- Capacity caps / waitlist logic.
- Per-week custom imagery managed from admin (currently a single static hero image for Afterglow).

## Files touched

- `supabase` migration (additive columns on `event_signups`)
- `src/components/AfterglowRSVP.tsx` (new)
- `src/pages/WhatsHappening.tsx` (insert featured block + JSON-LD)
- `src/pages/Admin.tsx` (show new columns + filter)
