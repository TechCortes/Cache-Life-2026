

## Goal
Add a dedicated **Partnerships** section to the homepage displaying ~20 partner logos sourced from cachelifeny.com, all rendered as PNG images, styled to match the dark luxury aesthetic.

## Approach

### 1. Source the logos
Fetch `https://cachelifeny.com/` and locate the partnerships/clients section. Extract every PNG logo URL (filter to `.png` only — skip `.svg`, `.jpg`, `.webp`). The site already hosts most partner logos as PNGs at `cachelifeny.com/wp-content/uploads/...`. For any partner whose logo is not natively a PNG on the source site, substitute a PNG version from a reliable CDN (e.g. Wikimedia, official brand assets) so every entry is `.png`.

### 2. Add a `Partnerships` section to `src/pages/Index.tsx`
Insert a new `<FadeIn>`-wrapped `<section>` between the existing **Services** and **Showreel** sections.

```tsx
const partners = [
  { name: "Partner Name", logo: "https://.../logo.png" },
  // ...~20 entries, all .png
];

<FadeIn>
  <section className="max-w-6xl mx-auto px-6 py-20">
    <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4 text-center">
      Trusted By
    </p>
    <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground text-center mb-16">
      Partnerships
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
      {partners.map((p) => (
        <div key={p.name} className="flex items-center justify-center aspect-[3/2] p-4">
          <img
            src={p.logo}
            alt={p.name}
            loading="lazy"
            className="max-h-12 md:max-h-16 w-auto object-contain opacity-70 hover:opacity-100 brightness-0 invert transition-opacity duration-300"
          />
        </div>
      ))}
    </div>
  </section>
</FadeIn>
```

### 3. Styling rules (matches existing site)
- **All-white logos** via `brightness-0 invert` (consistent with the Press/Media page treatment).
- Muted `opacity-70` with hover reveal — quiet, gallery-like.
- Responsive grid: 2 cols (mobile) → 5 cols (desktop), 8-unit gap.
- Reuse the existing `FadeIn` scroll-reveal wrapper.
- No new design tokens, no new dependencies.

### 4. PNG-only enforcement
Every URL in the `partners` array will end in `.png`. During implementation, any non-PNG source from cachelifeny.com will be swapped for an equivalent PNG from official brand assets or a reputable CDN before commit.

### 5. Out of scope
- No database — logos hard-coded (matches existing `services` array pattern).
- No edits to other pages, navbar, routing, or backend.
- No SVG/WebP logos.

## Files touched
- `src/pages/Index.tsx` — add `partners` array + new `<Partnerships>` section between Services and Showreel.

