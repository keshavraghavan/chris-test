# ASCII Footer — "Christopher Prigg"

**Date:** 2026-06-04
**Status:** Approved design, pending implementation plan

## Goal

Add a decorative ASCII-art banner spelling **"Christopher Prigg"** to the bottom of the home page (`app/page.tsx`). The banner uses figlet-style block letters, stacked on two lines ("Christopher" above, "Prigg" below), and reveals one letter at a time on mount in a typewriter animation.

## Non-goals

- Persisting the footer across other routes (lives only on the home page).
- Adding a runtime `figlet` dependency or generating ASCII at runtime.
- Interactive behavior beyond the initial reveal (no hover, no replay).
- Modifying `app/layout.tsx`.

## Architecture

Two file changes, no new dependencies:

1. **`app/AsciiFooter.tsx`** — new client component (`"use client"`). Owns the figlet glyph map, the reveal animation state, and the reduced-motion check.
2. **`app/page.tsx`** — restructured to a flex column: a `flex-1` wrapper centers the existing welcome heading, and `<AsciiFooter />` sits below with bottom padding. Remains a server component.

`app/layout.tsx` is unchanged. The `body` already has `min-h-full flex flex-col`, which accommodates the new page structure.

## Component design: `AsciiFooter`

### Glyph data

A `const LETTERS: Record<string, string[]>` map, case-sensitive, with each value being a 5-element string array (one entry per row of the figlet `standard` font). Only the 11 characters needed are included: `C`, `h`, `r`, `i`, `s`, `t`, `o`, `p`, `e`, `P`, `g`. The two words render in separate `<pre>` blocks, so no inter-word space glyph is needed.

Glyphs are pre-generated using figlet's `standard` font and committed verbatim as string literals. No runtime ASCII generation, no build-time codegen.

Row widths can differ per letter; that is fine because each letter contributes the same number of rows (5), and concatenating row N across the revealed letters produces a single banner line.

### Rendering

Two `<pre>` blocks, one per word:

- Line 1: "Christopher" — 11 letters
- Line 2: "Prigg" — 5 letters

For each `<pre>`:

1. Take the first `revealedInThisWord` letters of the word.
2. For each row index 0..4, concatenate that row from every revealed letter, joined by a single space character (so letters don't visually fuse).
3. Join the 5 rows with `\n` and render inside a single `<pre>` so the monospace alignment is preserved.

Styling:

- `font-mono`, `text-zinc-400 dark:text-zinc-600`, `text-center`, `leading-none`, `text-xs sm:text-sm` (chosen so the wider "Christopher" banner fits comfortably on a typical viewport; final size validated during implementation).
- Container: `pb-8 pt-4 w-full flex flex-col items-center gap-2`.
- The wrapping `<div>` carries `aria-label="Christopher Prigg"`; both `<pre>` elements are `aria-hidden`.

### Animation

State:

```ts
const TOTAL_LETTERS = "ChristopherPrigg".length; // 16
const [revealed, setRevealed] = useState<number>(0);
```

Effect:

- On mount, check `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. If true, set `revealed` to `TOTAL_LETTERS` immediately and skip the interval.
- Otherwise, start a `setInterval` (~100 ms) that increments `revealed` by 1 until it reaches `TOTAL_LETTERS`, then clears itself.
- Clean up the interval in the effect's cleanup function.

Mapping `revealed` → per-word counts:

- `christopherRevealed = Math.min(revealed, 11)`
- `priggRevealed = Math.max(0, revealed - 11)`

The two `<pre>` blocks are always mounted; their content grows over time. The "Prigg" `<pre>` simply starts empty (rendered as blank 5-row monospace block of fixed minimum height so the layout doesn't shift when its first letter appears — achieved by reserving height via `min-h-[5em]` or equivalent based on the chosen `text-xs/sm` size; exact value tuned during implementation).

### Reduced motion

When `prefers-reduced-motion: reduce` is active, the full banner renders immediately on the first paint that follows hydration. Server-rendered HTML shows nothing in the `<pre>` blocks; this is acceptable because the banner is decorative and `aria-hidden`. The visible welcome heading is still server-rendered and unaffected.

### Accessibility summary

- Wrapper `<div>` carries `aria-label="Christopher Prigg"` and `role="img"` so assistive tech announces it once as a single labeled image.
- The two `<pre>` elements are `aria-hidden="true"`.
- Reduced motion honored.
- No focusable elements introduced.

## Page restructure: `app/page.tsx`

Before:

```tsx
<div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
  <h1 ...>Chris welcome to vibe coding</h1>
</div>
```

After:

```tsx
<div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
  <main className="flex flex-1 items-center justify-center">
    <h1 ...>Chris welcome to vibe coding</h1>
  </main>
  <AsciiFooter />
</div>
```

The outer container keeps `flex-1` so it still fills the body's flex column. The inner `<main>` keeps the centered heading exactly where it was. `<AsciiFooter />` sits below at the natural bottom of the viewport.

## Data flow

There is no data flow beyond the component-local `revealed` counter. No props on `AsciiFooter`. No external state.

## Error handling

There is no failure mode worth handling:

- The glyph map is a static constant compiled into the bundle.
- The `matchMedia` check is wrapped in a `typeof window !== "undefined"` guard inside the effect (effects only run client-side, but the guard is cheap insurance).
- The interval is cleared on unmount.

## Testing

This is a decorative, behavior-light component. Verification:

- Manual: `npm run dev`, load `/`, confirm: welcome heading still centered; banner appears at the bottom; reveal animates one letter at a time; "Prigg" begins only after "Christopher" finishes; full banner renders immediately when reduced motion is enabled (toggle via OS or DevTools emulation).
- Build: `npm run build` succeeds with no type errors.

No unit tests added — the project currently has no test harness and this change does not warrant introducing one.

## Open considerations (resolved during implementation)

- **Exact reveal interval** — start at 100 ms; tune to taste.
- **Text size** — start at `text-xs sm:text-sm`; verify "Christopher" fits at common widths (≥360 px) without horizontal overflow. If it overflows on narrow screens, reduce to `text-[10px]` at the smallest breakpoint.
- **Reserved height for the "Prigg" block** — set to the rendered height of a populated 5-row block at the chosen text size; verified visually to prevent layout shift when the first "P" appears.
