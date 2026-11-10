/**
 * Rosé Pine → DeepSeek Harness Web UI theme tokens.
 *
 * Every one of the 118 DSH theme token names (see docs/builtin-tokens.json) is
 * resolved to a fully-resolved CSS color for each official Rosé Pine variant:
 *
 *   main  → dark  (theme id rose-pine)
 *   moon  → dark  (theme id rose-pine-moon)
 *   dawn  → light (theme id rose-pine-dawn)
 *
 * Hex values come from @rose-pine/palette (the installed package is the
 * authority, nothing is hardcoded); rgba() values are the same palette colors
 * with an alpha channel. The only non-palette colors are the neutral scrim /
 * tool-bar / shimmer masks, which are copied from the built-in defaults in
 * docs/builtin-tokens.json exactly as SPEC.md §3.2 requires.
 *
 * Deviations from SPEC.md §3 (with reasons):
 *   1. --dsw-alias-label-tertiary (dawn): SPEC says muted (#9893a5), but that is
 *      2.7:1 on bg-base and SPEC §4 requires >= 3:1. Nearest palette role that
 *      passes is subtle (#797593, 4.06:1), so dawn uses subtle here.
 *   2. --dsw-alias-tooltip-key-bg: SPEC says rgba(highlightMed, .18); at that
 *      alpha the chip is imperceptible on the tooltip (surface ≈ tooltip-bg).
 *      Dark uses rgba(highlightMed, .35) instead; dawn uses rgba(highlightMed,
 *      .18) as SPEC says (light tooltip-bg is text, so the chip reads fine).
 *   3. --dsw-alias-border-inverted*: SPEC says follow the highlightMed/
 *      highlightHigh border family, but these sit on inverted solid surfaces
 *      (toast / tooltip) where the highlight family is invisible. Dark uses
 *      rgba(text, .06/.10); dawn reproduces the built-in transparent default.
 *   4. label-deep-diving / label-deep-diving-shimmer, menu-icon, document
 *      selection, sidebar-nav accent and turn-trigger tokens have no explicit
 *      SPEC rule; they use the nearest semantic palette role (iris = brand /
 *      thinking accent, subtle = icon, iris tint = selection/accent) or the
 *      interactive-hover analogue for turn triggers.
 */

import { variants } from '@rose-pine/palette'

export const VARIANTS = ['main', 'moon', 'dawn']

export const THEMES = [
  { id: 'rose-pine', name: 'Rosé Pine', variant: 'main', colorScheme: 'dark' },
  { id: 'rose-pine-moon', name: 'Rosé Pine Moon', variant: 'moon', colorScheme: 'dark' },
  { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn', variant: 'dawn', colorScheme: 'light' },
]

/** The 15 official palette roles, in official order. */
export const PALETTE_ROLES = [
  'base',
  'surface',
  'overlay',
  'muted',
  'subtle',
  'text',
  'love',
  'gold',
  'rose',
  'pine',
  'foam',
  'iris',
  'highlightLow',
  'highlightMed',
  'highlightHigh',
]

/** role -> '#rrggbb', lowercase, taken from @rose-pine/palette. */
export const PALETTE = Object.fromEntries(
  VARIANTS.map((variant) => [
    variant,
    Object.fromEntries(
      PALETTE_ROLES.map((role) => [role, `#${variants[variant].colors[role].hex}`]),
    ),
  ]),
)

/** A token value source: a solid palette role. */
const s = (role) => ['solid', role]

/** A token value source: a palette role at some alpha. */
const a = (role, alpha) => ['fade', role, alpha]

/*
 * Dark scheme (main, moon): DSH built-in dark defaults <=> Rosé Pine dark.
 * Light scheme (dawn): DSH built-in light defaults <=> Rosé Pine dawn.
 * Both maps must contain the exact same 118 token names.
 */
const DARK = {
  // ── backgrounds ─────────────────────────────────────────────────────────
  '--dsw-alias-bg-base': s('base'),
  '--dsw-alias-bg-document-preview': s('base'),
  '--dsw-alias-bg-document-selection': a('iris', 0.4),
  '--dsw-alias-bg-layer-1': s('surface'),
  '--dsw-alias-bg-layer-2': s('overlay'),
  '--dsw-alias-bg-layer-3': s('highlightMed'),
  // Neutral scrims: built-in defaults, not theme colors (SPEC §3.2).
  '--dsw-alias-bg-mask-1': '#00000080',
  '--dsw-alias-bg-mask-2': '#00000033',
  '--dsw-alias-bg-mask-3': '#0000007a',
  '--dsw-alias-bg-mask-drop': '#272730b3',
  '--dsw-alias-bg-mask-photo': '#000000e0',
  '--dsw-alias-bg-module-platform': s('highlightLow'),
  '--dsw-alias-bg-multi-select': s('highlightLow'),
  '--dsw-alias-bg-overlay': s('overlay'),
  '--dsw-alias-bg-skeleton': '#ffffff14',

  // ── borders ─────────────────────────────────────────────────────────────
  '--dsw-alias-border-inverted': a('text', 0.06),
  '--dsw-alias-border-inverted2': a('text', 0.1),
  '--dsw-alias-border-l1': s('highlightMed'),
  '--dsw-alias-border-l2': s('highlightHigh'),
  '--dsw-alias-border-l2-darkmode-thin': a('highlightHigh', 0.55),
  '--dsw-alias-border-l3': s('highlightHigh'),
  '--dsw-alias-border-l4': s('highlightHigh'),

  // ── brand / accent ──────────────────────────────────────────────────────
  '--dsw-alias-brand-primary': s('iris'),
  '--dsw-alias-brand-primary-invert': s('base'),
  '--dsw-alias-brand-primary-new-colorprimary-new-color': s('iris'),
  '--dsw-alias-brand-text': s('base'),

  // ── buttons ─────────────────────────────────────────────────────────────
  '--dsw-alias-button-contrast-fill': s('text'),
  '--dsw-alias-button-elevated-fill': s('surface'),
  '--dsw-alias-button-floating-fill': s('surface'),
  '--dsw-alias-button-floating-hover': s('overlay'),
  '--dsw-alias-button-ghost-active-border': s('subtle'),
  '--dsw-alias-button-ghost-active-fill': s('highlightLow'),
  '--dsw-alias-button-ghost-active-hover': s('overlay'),
  '--dsw-alias-button-info-fill': s('foam'),
  '--dsw-alias-button-info-hover': s('iris'),
  '--dsw-alias-button-primary-dimmed': s('highlightMed'),
  '--dsw-alias-button-primary-fill': s('iris'),
  '--dsw-alias-button-primary-hover': s('rose'),
  // Neutral tool-bar alphas: built-in defaults (SPEC §3.2).
  '--dsw-alias-button-tool-bar-fill': '#54555780',
  '--dsw-alias-button-tool-bar-fill-invisible': '#1f1f1f5c',
  '--dsw-alias-button-tool-bar-hover': '#54555799',

  // ── diff ────────────────────────────────────────────────────────────────
  '--dsw-alias-code-diff-added': a('pine', 0.12),
  '--dsw-alias-code-diff-deleted': a('love', 0.12),
  '--dsw-alias-file-diff-added-bg': a('pine', 0.14),
  '--dsw-alias-file-diff-added-gutter': a('pine', 0.08),
  '--dsw-alias-file-diff-added-marker': s('pine'),
  '--dsw-alias-file-diff-deleted-bg': a('love', 0.14),
  '--dsw-alias-file-diff-deleted-gutter': a('love', 0.08),
  '--dsw-alias-file-diff-deleted-marker': s('love'),

  // ── illustration ────────────────────────────────────────────────────────
  '--dsw-alias-illustration-background': s('surface'),
  '--dsw-alias-illustration-backing': s('highlightMed'),
  '--dsw-alias-illustration-detail': s('highlightHigh'),
  '--dsw-alias-illustration-inset': s('highlightMed'),
  '--dsw-alias-illustration-shadow': s('highlightMed'),
  '--dsw-alias-illustration-surface': s('highlightLow'),

  // ── interactive ─────────────────────────────────────────────────────────
  '--dsw-alias-interactive-bg-active': a('text', 0.12),
  '--dsw-alias-interactive-bg-hover': a('text', 0.08),
  '--dsw-alias-interactive-bg-hover-accent': a('text', 0.2),
  '--dsw-alias-interactive-bg-hover-danger': a('love', 0.12),
  '--dsw-alias-interactive-bg-hover-solid': s('highlightLow'),

  // ── labels ──────────────────────────────────────────────────────────────
  '--dsw-alias-label-caption': s('muted'),
  '--dsw-alias-label-deep-diving': s('iris'),
  '--dsw-alias-label-deep-diving-shimmer': a('iris', 0.55),
  '--dsw-alias-label-dimmed': s('muted'),
  '--dsw-alias-label-document-preview': s('subtle'),
  '--dsw-alias-label-primary': s('text'),
  '--dsw-alias-label-primary-bluish': s('foam'),
  '--dsw-alias-label-primary-dimmed': s('text'),
  '--dsw-alias-label-primary-foreground': s('base'),
  '--dsw-alias-label-primary-inverted': s('surface'),
  '--dsw-alias-label-secondary': s('subtle'),
  // Neutral shimmer mask: resolved built-in color-mix(neutral-00 45%, transparent).
  '--dsw-alias-label-shimmer': '#ffffff73',
  '--dsw-alias-label-tertiary': s('muted'),
  '--dsw-alias-link': s('foam'),

  // ── markdown / code ─────────────────────────────────────────────────────
  '--dsw-alias-markdown-citation': s('highlightLow'),
  '--dsw-alias-markdown-code-block': s('surface'),
  '--dsw-alias-markdown-code-block-banner': s('overlay'),
  '--dsw-alias-markdown-code-segment-selected': s('overlay'),
  '--dsw-alias-markdown-code-segment-unselected': s('surface'),
  '--dsw-alias-markdown-inline-code': s('overlay'),
  '--dsw-alias-markdown-placeholder': s('highlightLow'),
  '--dsw-alias-markdown-tag': s('highlightMed'),

  // ── menus / scrollbars ──────────────────────────────────────────────────
  '--dsw-alias-menu-group-header-fill': a('surface', 0.94),
  '--dsw-alias-menu-icon': s('subtle'),
  '--dsw-alias-scrollbar-bg-l1': s('highlightHigh'),
  '--dsw-alias-scrollbar-bg-l2': s('highlightHigh'),
  '--dsw-alias-scrollbar-hover-l1': s('muted'),
  '--dsw-alias-scrollbar-hover-l2': s('muted'),

  // ── states ──────────────────────────────────────────────────────────────
  '--dsw-alias-state-business-primary': s('iris'),
  '--dsw-alias-state-business-tertiary': s('highlightMed'),
  '--dsw-alias-state-done-primary': s('rose'),
  '--dsw-alias-state-error-primary': s('love'),
  '--dsw-alias-state-error-secondary': s('rose'),
  '--dsw-alias-state-idle-primary': s('muted'),
  '--dsw-alias-state-success-primary': s('pine'),
  '--dsw-alias-state-success-secondary': s('foam'),
  '--dsw-alias-state-success-tertiary': s('highlightMed'),
  '--dsw-alias-state-warn-label': s('gold'),
  '--dsw-alias-state-warn-primary': s('gold'),
  '--dsw-alias-state-warn-secondary': s('rose'),
  '--dsw-alias-state-warn-tertiary': s('highlightMed'),

  // ── misc ────────────────────────────────────────────────────────────────
  '--dsw-alias-switch-thumb': s('text'),
  '--dsw-alias-toast-bg': s('highlightHigh'),
  '--dsw-alias-toast-label': s('text'),
  '--dsw-alias-tooltip-bg': s('surface'),
  '--dsw-alias-tooltip-key-bg': a('highlightMed', 0.35),
  '--dsw-alias-turn-trigger-bg': a('text', 0.08),
  '--dsw-alias-turn-trigger-bg-hover': a('text', 0.12),

  // ── specific containers ─────────────────────────────────────────────────
  '--dsw-specific-bubble': s('overlay'),
  '--dsw-specific-bubble-highlight': s('highlightMed'),
  '--dsw-specific-input-major': s('surface'),
  '--dsw-specific-login-input': s('surface'),
  '--dsw-specific-menu': a('surface', 0.94),
  '--dsw-specific-selector': s('highlightLow'),
  '--dsw-specific-sidebar-fill': s('highlightLow'),
  '--dsw-specific-sidebar-nav-item-active': s('overlay'),
  '--dsw-specific-sidebar-nav-item-active-accent': a('iris', 0.18),
  '--dsw-specific-tip': s('highlightLow'),
}

const LIGHT = {
  // ── backgrounds ─────────────────────────────────────────────────────────
  '--dsw-alias-bg-base': s('base'),
  '--dsw-alias-bg-document-preview': s('highlightLow'),
  '--dsw-alias-bg-document-selection': a('iris', 0.3),
  '--dsw-alias-bg-layer-1': s('surface'),
  '--dsw-alias-bg-layer-2': s('highlightLow'),
  '--dsw-alias-bg-layer-3': s('highlightMed'),
  // Neutral scrims: built-in defaults, not theme colors (SPEC §3.2).
  '--dsw-alias-bg-mask-1': '#0000003d',
  '--dsw-alias-bg-mask-2': '#0000001f',
  '--dsw-alias-bg-mask-3': '#0000007a',
  '--dsw-alias-bg-mask-drop': '#ffffffb3',
  '--dsw-alias-bg-mask-photo': '#000000e0',
  '--dsw-alias-bg-module-platform': s('overlay'),
  '--dsw-alias-bg-multi-select': s('overlay'),
  '--dsw-alias-bg-overlay': s('overlay'),
  '--dsw-alias-bg-skeleton': '#0000000a',

  // ── borders ─────────────────────────────────────────────────────────────
  // Built-in light defaults are fully transparent (#0000); no inverted borders.
  '--dsw-alias-border-inverted': 'transparent',
  '--dsw-alias-border-inverted2': 'transparent',
  '--dsw-alias-border-l1': s('highlightMed'),
  '--dsw-alias-border-l2': s('highlightHigh'),
  '--dsw-alias-border-l2-darkmode-thin': a('highlightHigh', 0.55),
  '--dsw-alias-border-l3': s('highlightHigh'),
  '--dsw-alias-border-l4': s('highlightHigh'),

  // ── brand / accent ──────────────────────────────────────────────────────
  '--dsw-alias-brand-primary': s('iris'),
  '--dsw-alias-brand-primary-invert': s('base'),
  '--dsw-alias-brand-primary-new-colorprimary-new-color': s('iris'),
  '--dsw-alias-brand-text': s('base'),

  // ── buttons ─────────────────────────────────────────────────────────────
  '--dsw-alias-button-contrast-fill': s('text'),
  '--dsw-alias-button-elevated-fill': s('surface'),
  '--dsw-alias-button-floating-fill': s('surface'),
  '--dsw-alias-button-floating-hover': s('overlay'),
  '--dsw-alias-button-ghost-active-border': s('subtle'),
  '--dsw-alias-button-ghost-active-fill': s('highlightLow'),
  '--dsw-alias-button-ghost-active-hover': s('overlay'),
  '--dsw-alias-button-info-fill': s('foam'),
  '--dsw-alias-button-info-hover': s('iris'),
  '--dsw-alias-button-primary-dimmed': s('highlightMed'),
  '--dsw-alias-button-primary-fill': s('iris'),
  '--dsw-alias-button-primary-hover': s('rose'),
  // Neutral tool-bar alphas: built-in defaults (SPEC §3.2).
  '--dsw-alias-button-tool-bar-fill': '#54555780',
  '--dsw-alias-button-tool-bar-fill-invisible': '#1f1f1f5c',
  '--dsw-alias-button-tool-bar-hover': '#54555799',

  // ── diff ────────────────────────────────────────────────────────────────
  '--dsw-alias-code-diff-added': a('pine', 0.08),
  '--dsw-alias-code-diff-deleted': a('love', 0.08),
  '--dsw-alias-file-diff-added-bg': a('pine', 0.1),
  '--dsw-alias-file-diff-added-gutter': a('pine', 0.06),
  '--dsw-alias-file-diff-added-marker': s('pine'),
  '--dsw-alias-file-diff-deleted-bg': a('love', 0.1),
  '--dsw-alias-file-diff-deleted-gutter': a('love', 0.06),
  '--dsw-alias-file-diff-deleted-marker': s('love'),

  // ── illustration ────────────────────────────────────────────────────────
  '--dsw-alias-illustration-background': s('highlightLow'),
  '--dsw-alias-illustration-backing': s('highlightMed'),
  '--dsw-alias-illustration-detail': s('highlightHigh'),
  '--dsw-alias-illustration-inset': s('highlightMed'),
  '--dsw-alias-illustration-shadow': s('highlightMed'),
  '--dsw-alias-illustration-surface': s('overlay'),

  // ── interactive ─────────────────────────────────────────────────────────
  '--dsw-alias-interactive-bg-active': a('text', 0.12),
  '--dsw-alias-interactive-bg-hover': a('text', 0.08),
  '--dsw-alias-interactive-bg-hover-accent': a('text', 0.2),
  '--dsw-alias-interactive-bg-hover-danger': a('love', 0.1),
  '--dsw-alias-interactive-bg-hover-solid': s('highlightLow'),

  // ── labels ──────────────────────────────────────────────────────────────
  '--dsw-alias-label-caption': s('muted'),
  '--dsw-alias-label-deep-diving': s('iris'),
  '--dsw-alias-label-deep-diving-shimmer': a('iris', 0.55),
  '--dsw-alias-label-dimmed': s('muted'),
  '--dsw-alias-label-document-preview': s('subtle'),
  '--dsw-alias-label-primary': s('text'),
  '--dsw-alias-label-primary-bluish': s('foam'),
  '--dsw-alias-label-primary-dimmed': s('text'),
  '--dsw-alias-label-primary-foreground': s('base'),
  '--dsw-alias-label-primary-inverted': s('surface'),
  '--dsw-alias-label-secondary': s('subtle'),
  // Neutral shimmer mask: resolved built-in color-mix(neutral-1000 30%, transparent).
  '--dsw-alias-label-shimmer': '#0000004d',
  // muted (#9893a5) is only 2.7:1 on dawn bg-base; SPEC §4 needs >= 3:1, so the
  // nearest passing palette role (subtle) is used here.
  '--dsw-alias-label-tertiary': s('subtle'),
  '--dsw-alias-link': s('foam'),

  // ── markdown / code ─────────────────────────────────────────────────────
  '--dsw-alias-markdown-citation': s('highlightLow'),
  '--dsw-alias-markdown-code-block': s('highlightLow'),
  '--dsw-alias-markdown-code-block-banner': s('surface'),
  '--dsw-alias-markdown-code-segment-selected': s('surface'),
  '--dsw-alias-markdown-code-segment-unselected': s('base'),
  '--dsw-alias-markdown-inline-code': s('highlightLow'),
  '--dsw-alias-markdown-placeholder': s('highlightLow'),
  '--dsw-alias-markdown-tag': s('highlightMed'),

  // ── menus / scrollbars ──────────────────────────────────────────────────
  '--dsw-alias-menu-group-header-fill': a('surface', 0.94),
  '--dsw-alias-menu-icon': s('subtle'),
  '--dsw-alias-scrollbar-bg-l1': s('highlightHigh'),
  '--dsw-alias-scrollbar-bg-l2': s('highlightHigh'),
  '--dsw-alias-scrollbar-hover-l1': s('muted'),
  '--dsw-alias-scrollbar-hover-l2': s('muted'),

  // ── states ──────────────────────────────────────────────────────────────
  '--dsw-alias-state-business-primary': s('iris'),
  '--dsw-alias-state-business-tertiary': s('highlightMed'),
  '--dsw-alias-state-done-primary': s('rose'),
  '--dsw-alias-state-error-primary': s('love'),
  '--dsw-alias-state-error-secondary': s('rose'),
  '--dsw-alias-state-idle-primary': s('muted'),
  '--dsw-alias-state-success-primary': s('pine'),
  '--dsw-alias-state-success-secondary': s('foam'),
  '--dsw-alias-state-success-tertiary': s('highlightMed'),
  '--dsw-alias-state-warn-label': s('gold'),
  '--dsw-alias-state-warn-primary': s('gold'),
  '--dsw-alias-state-warn-secondary': s('rose'),
  '--dsw-alias-state-warn-tertiary': s('highlightMed'),

  // ── misc ────────────────────────────────────────────────────────────────
  '--dsw-alias-switch-thumb': s('surface'),
  '--dsw-alias-toast-bg': s('text'),
  '--dsw-alias-toast-label': s('base'),
  '--dsw-alias-tooltip-bg': s('text'),
  '--dsw-alias-tooltip-key-bg': a('highlightMed', 0.18),
  '--dsw-alias-turn-trigger-bg': s('highlightLow'),
  '--dsw-alias-turn-trigger-bg-hover': a('text', 0.12),

  // ── specific containers ─────────────────────────────────────────────────
  '--dsw-specific-bubble': s('highlightLow'),
  '--dsw-specific-bubble-highlight': s('highlightMed'),
  '--dsw-specific-input-major': s('surface'),
  '--dsw-specific-login-input': s('surface'),
  '--dsw-specific-menu': a('surface', 0.94),
  '--dsw-specific-selector': s('overlay'),
  '--dsw-specific-sidebar-fill': s('overlay'),
  '--dsw-specific-sidebar-nav-item-active': s('highlightLow'),
  '--dsw-specific-sidebar-nav-item-active-accent': a('iris', 0.18),
  '--dsw-specific-tip': s('overlay'),
}

const SCHEMES = { dark: DARK, light: LIGHT }

/** All 118 DSH token names, sorted. */
export const TOKEN_NAMES = Object.keys(DARK).sort()

/** `${token} -> ['solid'|'fade', role, alpha?]` or a literal CSS color. */
function resolve(variant, source) {
  if (typeof source === 'string') return source
  const [kind, role, alpha] = source
  if (kind === 'solid') return PALETTE[variant][role]
  const [r, g, b] = variants[variant].colors[role].rgb
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * @param {'main'|'moon'|'dawn'} variant
 * @returns {Record<string, string>} all 118 token values for the variant.
 */
export function tokens(variant) {
  const scheme = variant === 'main' || variant === 'moon' ? 'dark' : variant === 'dawn' ? 'light' : undefined
  if (!scheme) throw new Error(`Unknown Rosé Pine variant: ${String(variant)}`)
  const map = SCHEMES[scheme]
  const out = {}
  for (const name of TOKEN_NAMES) out[name] = resolve(variant, map[name])
  return out
}

// Fail loudly at import time if the two scheme maps ever drift apart.
const lightNames = Object.keys(LIGHT).sort()
if (lightNames.length !== TOKEN_NAMES.length || lightNames.some((n, i) => n !== TOKEN_NAMES[i])) {
  throw new Error('src/tokens.js: dark and light token maps must contain the same 118 names')
}
