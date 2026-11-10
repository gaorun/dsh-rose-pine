# dsh-rose-pine — implementation spec (team source of truth)

Goal: a persistent DeepSeek Harness bundle named `dsh-rose-pine` that repaints the **Web UI** in Rosé Pine.
Repo: `/Users/run/my-repos/dsh-rose-pine` (this directory). Final answer must leave it installable into the
`desktop` profile and committed/pushed to https://github.com/gaorun/dsh-rose-pine.git by `run.gao <run.gao1993@gmail.com>`.

## Verified facts about the Harness theme system (do not re-derive; trusted)

- Client service `ctx.theme`:
  - `register({ id, colorScheme: 'light'|'dark', tokens: Record<string,string>, icons? }): () => void`
  - `overrideTokens(source: string, tokens: Record<string, { light: string, dark: string }>): () => void`
  - `getTheme(): { preference, active, themes, ... }`, `setTheme(id)`.
- `preference` is a **closed enum** `light | dark | system`; `setTheme('rose-pine')` is accepted in memory but
  **not persisted** (Host settings schema rejects/closes it). So a custom theme cannot be picked or persisted
  through the built-in Appearance row. That is why this plugin uses `overrideTokens`: the layer is re-applied on
  every page load and follows the user's existing light/dark/system preference.
- The palette presenter applies every token in `active.tokens` with `body.style.setProperty(name, value)`, so a
  token override wins over the stylesheet for both schemes. Full alias/specific token set: 118 names in
  `docs/builtin-tokens.json` (extracted from `@deepseek-ai/dsh-client-ui-theme`, where `body{}` = light defaults
  and `body[data-ds-dark-theme]{}` = dark defaults).
- Browser half format: `window.__ModuleLoader__.load({ id: 'dsh-rose-pine', factory: (require) => {...} })`.
  The factory may `require('react')`. The returned object supports `{ inject: ['theme', 'slots', 'locale'], apply(ctx) {} }`.
  Use `ctx.effect(cb)` for disposers, `ctx.slots.inject(slot, () => ctx.slots.register(...))` for UI rows.
  Bundle is loaded because `dsh.client.immediately: true`.

## Palette (official, from npm `@rose-pine/palette@4.0.1`, official registry)

| role | main | moon | dawn |
|---|---|---|---|
| base | #191724 | #232136 | #faf4ed |
| surface | #1f1d2e | #2a273f | #fffaf3 |
| overlay | #26233a | #393552 | #f2e9e1 |
| muted | #6e6a86 | #6e6a86 | #9893a5 |
| subtle | #908caa | #908caa | #797593 |
| text | #e0def4 | #e0def4 | #575279 |
| love | #eb6f92 | #eb6f92 | #b4637a |
| gold | #f6c177 | #f6c177 | #ea9d34 |
| rose | #ebbcba | #ea9a97 | #d7827e |
| pine | #31748f | #3e8fb0 | #286983 |
| foam | #9ccfd8 | #9ccfd8 | #56949f |
| iris | #c4a7e7 | #c4a7e7 | #907aa9 |
| highlightLow | #21202e | #2a283e | #f4ede8 |
| highlightMed | #403d52 | #44415a | #dfdad9 |
| highlightHigh | #524f67 | #56526e | #cecacd |

Theme ids / names (official variant ids): `rose-pine` (Rosé Pine, dark/main), `rose-pine-moon` (Rosé Pine Moon,
dark/moon), `rose-pine-dawn` (Rosé Pine Dawn, light/dawn).

## Files and owners (disjoint write scopes — do not write outside your scope)

| path | owner | content |
|---|---|---|
| `package.json`, `.npmrc`, `.gitignore`, `docs/builtin-tokens.json`, `SPEC.md` | Lead | already written, do not edit |
| `src/tokens.js` | token-mapper | palette access + variant → 118-token map |
| `scripts/build.mjs`, `test/theme.test.mjs`, `cordis.patch.yml`, `index.js`, `icon.svg` | bundle-engineer | build, validation, manifest rows, host half, icon |
| `README.md`, `LICENSE`, `locale/en.json`, `locale/zh.json` | docs-writer | docs + display metadata |
| `src/client.template.js`, `lib/client.js` (built) | Lead | browser half |

Everyone: `npm install` has been run by the Lead; `node_modules` exists. Do not run `npm install` or
`npm publish`. Use `node --test`, `node scripts/build.mjs` freely.

## `src/tokens.js` contract (consumed by build + tests)

```js
import { variants } from '@rose-pine/palette'

export const VARIANTS = ['main', 'moon', 'dawn']

export const THEMES = [
  { id: 'rose-pine',      name: 'Rosé Pine',      variant: 'main', colorScheme: 'dark'  },
  { id: 'rose-pine-moon', name: 'Rosé Pine Moon', variant: 'moon', colorScheme: 'dark'  },
  { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn', variant: 'dawn', colorScheme: 'light' },
]

// role -> '#rrggbb' (lowercase, with '#'), roles: base surface overlay muted subtle text
// love gold rose pine foam iris highlightLow highlightMed highlightHigh
export const PALETTE = { main: {...}, moon: {...}, dawn: {...} }

// All 118 names from docs/builtin-tokens.json, every value fully resolved (no var(...), no color-mix()).
export function tokens(variant) { /* returns Record<tokenName, cssColor> */ }
```

Mapping requirements:

1. Every one of the 118 token names must be present for each of the three variants.
2. Values must be CSS colors: `#rrggbb`, `#rrggbbaa`, `rgba(r, g, b, a)` or `transparent`, and must derive only
   from that variant's official palette (`PALETTE[variant]`), optionally with alpha. No invented hues.
   Exception: `--dsw-alias-bg-mask-*`, `--dsw-alias-bg-skeleton`, `--dsw-alias-button-tool-bar-*`,
   `--dsw-alias-label-shimmer` stay neutral black/white-alpha masks (these are scrims over content, not theme
   colors) — copy their built-in default values from `docs/builtin-tokens.json`.
3. Semantic mapping (adapt existing DSH meaning to palette roles):
   - backgrounds: base → base; layer-1 → surface (dark) / surface (light); layer-2 → overlay / highlightLow;
     layer-3 → highlightLow / highlightMed; overlay/popover → overlay; module-platform/selector/tip/multi-select →
     highlightLow (dark) / overlay (light); sidebar-fill → highlightLow (dark) / overlay (light); input-major →
     surface; login-input → surface; menu fill (alpha) → surface/overlay with alpha; bubble → highlightMed
     (dark) / highlightLow (light); bubble-highlight → highlightHigh (dark) / highlightMed (light).
   - text: label-primary → text; label-secondary → subtle; label-tertiary → muted; label-caption → muted;
     label-dimmed → muted; label-primary-dimmed → text; label-primary-foreground → base; label-primary-inverted →
     surface; brand-text → base (on brand fill); label-document-preview → subtle; label-primary-bluish → foam.
   - brand/accent: brand-primary → iris; brand-primary-new-color → iris; brand-primary-invert → base;
     link → foam; state-business-primary → iris; state-business-tertiary → highlightMed; state-done-primary → rose.
   - states: error-primary → love; error-secondary → rose; warn-* → gold (label → gold, primary → gold,
     secondary → rose, tertiary → highlightMed); success-primary → pine; success-secondary → foam;
     success-tertiary → highlightMed; idle-primary → muted.
   - borders: l1 → highlightMed with alpha (use rgba of highlightMed at 0.4/0.6/0.8 for l1/l2/l3/l4) but prefer
     solid highlightMed for l1 in dark and highlightHigh for l2/l3/l4; keep the light variant structurally
     analogous (highlightMed/highlightHigh are the light "borders"). `border-inverted*`, `border-l2-darkmode-thin`
     follow the same family.
   - interactive hover/active: rgba(text, 0.08/0.12/0.20) style per scheme (dark: rgba(#e0def4, …), light:
     rgba(#575279, …)) or highlightLow/highlightMed where a solid is used.
   - code/markdown: code-block → surface (dark) / highlightLow (light); code-block-banner → overlay (dark) /
     surface (light); inline-code → overlay (dark) / highlightLow (light); code-segment-selected → overlay /
     surface; code-segment-unselected → surface / base; citation → highlightLow; placeholder → highlightLow;
     tag → highlightMed.
   - diff: code-diff-added → rgba(pine, .12) dark / rgba(pine, .08) light; code-diff-deleted → rgba(love, .12) /
     rgba(love, .08); file-diff-added-bg → rgba(pine,.14) / rgba(pine,.10); added-gutter → same hue lower alpha;
     added-marker → pine (dark) / pine (light); deleted-* → love at the corresponding alphas.
   - illustration: background → surface (dark) / highlightLow (light); surface → highlightLow / overlay;
     backing → highlightMed; detail → highlightHigh; inset/shadow → same as backing.
   - toast-bg → highlightHigh (dark) / text (light: dark solid with light label) — keep toast-label readable:
     dark → text color on highlightHigh, light → base color on text. tooltip-bg → surface (dark) / text (light),
     tooltip-key-bg → rgba(surface/highlightMed, .18); switch-thumb → text (dark) / surface (light).
   - scrollbar-bg-l1/l2 → muted; scrollbar-hover-l1/l2 → subtle.
   - buttons: primary-fill → brand-primary (iris); primary-hover → iris lightened is NOT allowed, so use rose for
     hover in dark and pine for hover in light? Rule: use a *different palette role* per state — primary-hover →
     paint with `rose`; primary-dimmed → highlightMed; contrast-fill → text (dark) / text (light), with
     brand-text/label-primary-foreground set so contrast text stays readable; elevated-fill → surface;
     floating-fill → surface; floating-hover → overlay; ghost-active-fill → highlightLow; ghost-active-hover →
     overlay; ghost-active-border → subtle; info-fill → foam; info-hover → iris; tool-bar-* keep neutral alphas.
   - `interactive-bg-hover-solid`, `turn-trigger-*`, `bg-document-*`, `bg-multi-select`, `bg-skeleton`,
     `bg-mask-*`: follow the same families (turn-trigger-bg → code-block / interactive hover analogue).
4. Readability: for each variant, `label-primary` on `bg-base`, `bg-layer-1`, `specific-sidebar-fill`,
   `specific-bubble` must reach WCAG contrast ≥ 4.5:1; `label-secondary` and `label-tertiary` on `bg-base` ≥ 3:1.
   If a rule above would fail, choose the nearest palette role that passes and note it in your report.
5. Export a `TOKEN_NAMES` array of the 118 names (sorted) too; tests compare it against
   `docs/builtin-tokens.json` keys.

Keep the file dependency-free apart from `@rose-pine/palette`; ESM, no TypeScript.

## `scripts/build.mjs` (bundle-engineer)

- Import `THEMES, PALETTE, tokens` from `../src/tokens.js`.
- Read `src/client.template.js`, replace the single line `/* @rose-pine-data */` with
  `const ROSE_PINE = <JSON.stringify(data, null, 2)>;` where
  `data = { themes: THEMES.map(t => ({ ...t, tokens: tokens(t.variant) })), palette: PALETTE, strings }`
  and `strings` is the `rosePine` object of `locale/en.json` and `locale/zh.json` (title, description,
  darkVariant, main, moon, dawnHint) — the browser bundle cannot read files, so the build inlines them.
- Fail loudly if the marker is missing or a theme's token count !== 118.
- Prepend a generated-file banner (`// Generated by scripts/build.mjs — do not edit; edit src/ instead.`).
- Write `lib/client.js` (UTF-8, trailing newline), print a one-line summary. No bundler, no network.

## `test/theme.test.mjs` (bundle-engineer)

`node --test`, zero extra deps. Assert at least:
- palette fidelity against `@rose-pine/palette` (`variants[<key>].colors[role].hex` prefixed with `#`);
- each variant covers exactly the 118 names from `docs/builtin-tokens.json` (both light and dark key sets);
- every value matches `/^#[0-9a-f]{6}([0-9a-f]{2})?$/` or `/^rgba?\(/` or is `transparent`; no `var(` / `color-mix(`;
  hex values are palette colors of that variant (mask exceptions listed in the spec allowed);
- contrast assertions from rule 4;
- `lib/client.js` exists, has no `@rose-pine-data` marker, and the embedded `ROSE_PINE` JSON parses with 3 themes
  × 118 tokens (statically: locate `const ROSE_PINE = ` up to `;\n` and `JSON.parse`).

## `index.js` (Host half, bundle-engineer)

`export function apply(ctx, config) {}` — Host has nothing to do; register nothing, but keep the function so the
bundle row activates and its display metadata shows in Plugin Manager. Optionally `export const Config = ...` with
no fields? No: omit Config. Add a short header comment explaining that the browser half does the work.

## `cordis.patch.yml` (bundle-engineer)

```yaml
# Rosé Pine for DeepSeek Harness: the browser half (lib/client.js) paints the Web UI theme tokens.
- insert:
    - id: rose-pine
      name: 'dsh-rose-pine'
```

## `icon.svg` (bundle-engineer)

Original artwork, 64×64 viewBox, uses the Rosé Pine palette (pine #31748f, rose #ebbcba, base #191724). A simple
rose/pine mark; must be valid standalone SVG (no external refs, no script). Keep under 8 KiB.

## `locale/en.json` / `locale/zh.json` (docs-writer)

```json
{ "meta": { "title": "Rosé Pine", "description": "…one sentence, sentence case, names all three variants…" } }
```
zh: natural Simplified Chinese, same fields. Also add a `rosePine` section used by the settings row:
`{ "meta": {...}, "rosePine": { "title": "...", "description": "...", "darkVariant": "...", "main": "...", "moon": "...", "dawnHint": "..." } }`.
Lead's client template reads `rosePine.*` through `ctx.locale` at runtime via the same keys — keep keys exactly:
`title`, `description`, `darkVariant`, `main`, `moon`, `dawnHint`.

## README.md (docs-writer)

Structure: what it is (one paragraph), the three variants, palette table (from this spec), how it maps onto DSH
tokens (short, grouped), install (Plugin Manager bundle directory install / `install_bundle`), how variants are
chosen (follows Appearance light/dark; the Rosé Pine row in Settings → General switches the dark variant between
Rosé Pine and Rosé Pine Moon; dawn is automatic in light), development (`npm install`, `npm run build`, `npm test`),
project layout, credits (Rosé Pine by mvllow & contributors, MIT-ish palette license note + link
https://rosepinetheme.com), license. English. Cite https://rosepinetheme.com/en/create/create-a-theme/ and
https://rosepinetheme.com/en/palette/. Do not claim screenshots unless provided.

## LICENSE (docs-writer)

MIT, `Copyright (c) 2026 run.gao`. Also a short notice that the Rosé Pine palette is by the Rosé Pine community.
