// Validation for the dsh-rose-pine bundle: palette fidelity, full 118-token
// coverage, CSS-color validity, WCAG contrast, and the built browser half.
//
// Zero extra dependencies: `node --test test/*.test.mjs`.

import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { test } from 'node:test'

import { variants } from '@rose-pine/palette'

import { PALETTE, THEMES, TOKEN_NAMES, VARIANTS, tokens } from '../src/tokens.js'

const DOCS_PATH = new URL('../docs/builtin-tokens.json', import.meta.url)
const CLIENT_PATH = new URL('../lib/client.js', import.meta.url)
const MANIFEST_PATH = new URL('../cordis.patch.yml', import.meta.url)
const ICON_PATH = new URL('../icon.svg', import.meta.url)
const LOCALE_DIR = new URL('../locale/', import.meta.url)
const ROW_STRING_KEYS = ['title', 'description', 'lightScheme', 'darkScheme', 'darkVariant', 'main', 'moon', 'dawnHint']

const DOCS = JSON.parse(readFileSync(DOCS_PATH, 'utf8'))
const EXPECTED_TOKEN_NAMES = [...new Set([...Object.keys(DOCS.light), ...Object.keys(DOCS.dark)])].sort()
const EXPECTED_TOKEN_COUNT = 118

const ROLES = [
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

// Tokens the spec keeps as neutral black/white scrims regardless of variant.
const NEUTRAL_EXCEPTIONS = [
  '--dsw-alias-bg-mask-',
  '--dsw-alias-bg-skeleton',
  '--dsw-alias-button-tool-bar-',
  '--dsw-alias-label-shimmer',
]

const CSS_COLOR =
  /^(#[0-9a-f]{6}([0-9a-f]{2})?|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)|transparent)$/

function isNeutralException(name) {
  return NEUTRAL_EXCEPTIONS.some((prefix) => name.startsWith(prefix))
}

function parseColor(value) {
  const text = value.trim()
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }

  let match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(text)
  if (match) {
    const rgb = Number.parseInt(match[1], 16)
    return {
      r: (rgb >> 16) & 0xff,
      g: (rgb >> 8) & 0xff,
      b: rgb & 0xff,
      a: match[2] ? Number.parseInt(match[2], 16) / 255 : 1,
    }
  }

  match = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|1|0?\.\d+)\s*)?\)$/.exec(text)
  if (match) {
    return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] === undefined ? 1 : Number(match[4]) }
  }

  return null
}

function over(foreground, background) {
  const alpha = foreground.a
  return {
    r: alpha * foreground.r + (1 - alpha) * background.r,
    g: alpha * foreground.g + (1 - alpha) * background.g,
    b: alpha * foreground.b + (1 - alpha) * background.b,
    a: 1,
  }
}

function luminance(color) {
  const channel = (value) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b)
}

function contrastRatio(foreground, background) {
  const first = luminance(foreground)
  const second = luminance(background)
  const [lighter, darker] = first >= second ? [first, second] : [second, first]
  return (lighter + 0.05) / (darker + 0.05)
}

/** `#rrggbb` palette colors of a variant, as `rrggbb` and `r,g,b` lookups. */
function paletteLookups(variant) {
  const hex = new Set()
  const rgb = new Set()
  for (const value of Object.values(PALETTE[variant])) {
    const color = parseColor(value)
    assert.ok(color, `PALETTE.${variant} contains a non-color: ${value}`)
    hex.add(`${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b
      .toString(16)
      .padStart(2, '0')}`)
    rgb.add(`${color.r},${color.g},${color.b}`)
  }
  return { hex, rgb }
}

test('VARIANTS, THEMES and PALETTE match the official Rosé Pine definitions', () => {
  assert.deepEqual(VARIANTS, ['main', 'moon', 'dawn'])
  assert.deepEqual(
    THEMES.map((theme) => [theme.id, theme.name, theme.variant, theme.colorScheme]),
    [
      ['rose-pine', 'Rosé Pine', 'main', 'dark'],
      ['rose-pine-moon', 'Rosé Pine Moon', 'moon', 'dark'],
      ['rose-pine-dawn', 'Rosé Pine Dawn', 'dawn', 'light'],
    ],
  )

  assert.deepEqual(Object.keys(PALETTE).sort(), ['dawn', 'main', 'moon'])
  for (const variant of VARIANTS) {
    const official = variants[variant]
    assert.ok(official, `@rose-pine/palette has no variant "${variant}"`)
    assert.deepEqual(Object.keys(PALETTE[variant]).sort(), [...ROLES].sort())
    for (const role of ROLES) {
      assert.equal(PALETTE[variant][role].toLowerCase(), `#${official.colors[role].hex.toLowerCase()}`,
        `PALETTE.${variant}.${role} must match the official palette`)
    }
  }
})

test('each variant covers exactly the 118 built-in token names', () => {
  assert.equal(DOCS.tokenCount, EXPECTED_TOKEN_COUNT)
  assert.equal(Object.keys(DOCS.light).length, EXPECTED_TOKEN_COUNT)
  assert.deepEqual(Object.keys(DOCS.light).sort(), Object.keys(DOCS.dark).sort(),
    'built-in light and dark token name sets must agree')
  assert.equal(EXPECTED_TOKEN_NAMES.length, EXPECTED_TOKEN_COUNT)

  assert.equal(TOKEN_NAMES.length, EXPECTED_TOKEN_COUNT)
  assert.deepEqual([...TOKEN_NAMES].sort(), TOKEN_NAMES, 'TOKEN_NAMES must be sorted')
  assert.deepEqual(TOKEN_NAMES, EXPECTED_TOKEN_NAMES, 'TOKEN_NAMES must list the built-in token names')

  for (const variant of VARIANTS) {
    const names = Object.keys(tokens(variant)).sort()
    assert.equal(names.length, EXPECTED_TOKEN_COUNT, `variant "${variant}" must define ${EXPECTED_TOKEN_COUNT} tokens`)
    assert.deepEqual(names, EXPECTED_TOKEN_NAMES, `variant "${variant}" must cover the built-in token names`)
  }
})

test('every token value is a concrete CSS color derived from its variant palette', () => {
  for (const variant of VARIANTS) {
    const lookups = paletteLookups(variant)
    const map = tokens(variant)

    for (const [name, value] of Object.entries(map)) {
      assert.equal(typeof value, 'string', `${variant}/${name} must be a string`)
      const lowered = value.toLowerCase()
      assert.ok(!lowered.includes('var('), `${variant}/${name} still contains var(): ${value}`)
      assert.ok(!lowered.includes('color-mix('), `${variant}/${name} still contains color-mix(): ${value}`)
      assert.match(value, CSS_COLOR, `${variant}/${name} is not a supported CSS color: ${value}`)

      const color = parseColor(value)
      assert.ok(color, `${variant}/${name} could not be parsed: ${value}`)
      assert.ok(color.a >= 0 && color.a <= 1, `${variant}/${name} alpha out of range: ${value}`)
      for (const channel of [color.r, color.g, color.b]) {
        assert.ok(Number.isInteger(channel) && channel >= 0 && channel <= 255, `${variant}/${name} channel out of range: ${value}`)
      }

      // Masks/scrims are intentionally neutral; all other tokens must be palette-derived.
      if (isNeutralException(name) || lowered === 'transparent') continue

      if (value.startsWith('#')) {
        const hex = value.slice(1).toLowerCase()
        const base = hex.length === 8 ? hex.slice(0, 6) : hex
        assert.ok(lookups.hex.has(base), `${variant}/${name} uses a hex outside the ${variant} palette: ${value}`)
      } else if (color.a < 1 || lowered.startsWith('rgb')) {
        assert.ok(lookups.rgb.has(`${color.r},${color.g},${color.b}`),
          `${variant}/${name} uses rgb channels outside the ${variant} palette: ${value}`)
      }
    }
  }
})

test('label tokens keep readable contrast on the surfaces they are painted on', () => {
  const pairs = [
    ['--dsw-alias-label-primary', '--dsw-alias-bg-base', 4.5],
    ['--dsw-alias-label-primary', '--dsw-alias-bg-layer-1', 4.5],
    ['--dsw-alias-label-primary', '--dsw-specific-sidebar-fill', 4.5],
    ['--dsw-alias-label-primary', '--dsw-specific-bubble', 4.5],
    ['--dsw-alias-label-secondary', '--dsw-alias-bg-base', 3],
    ['--dsw-alias-label-tertiary', '--dsw-alias-bg-base', 3],
  ]

  for (const variant of VARIANTS) {
    const map = tokens(variant)
    const base = parseColor(map['--dsw-alias-bg-base'])
    assert.ok(base, `${variant}: bg-base is not a color`)

    for (const [labelName, backgroundColor, minimum] of pairs) {
      const label = parseColor(map[labelName])
      const background = parseColor(map[backgroundColor])
      assert.ok(label, `${variant}: ${labelName} is not a color`)
      assert.ok(background, `${variant}: ${backgroundColor} is not a color`)

      const surface = over(background, base)
      const ink = over(label, surface)
      const ratio = contrastRatio(ink, surface)
      assert.ok(ratio >= minimum,
        `${variant}: ${labelName} on ${backgroundColor} is ${ratio.toFixed(2)}:1, below ${minimum}:1`)
    }
  }
})

test('lib/client.js is built with the full theme data embedded', () => {
  assert.ok(existsSync(CLIENT_PATH), 'lib/client.js is missing — run `node scripts/build.mjs`')
  const source = readFileSync(CLIENT_PATH, 'utf8')

  assert.ok(source.startsWith('// Generated by scripts/build.mjs'), 'lib/client.js is missing the generated banner')
  assert.ok(!source.includes('@rose-pine-data'), 'lib/client.js still contains the template marker')

  const start = source.indexOf('const ROSE_PINE = ')
  assert.notEqual(start, -1, 'lib/client.js does not embed ROSE_PINE data')
  const end = source.indexOf(';\n', start)
  assert.notEqual(end, -1, 'lib/client.js has no terminating `;` after ROSE_PINE')

  const embedded = JSON.parse(source.slice(start + 'const ROSE_PINE = '.length, end))
  assert.deepEqual(embedded.palette, PALETTE)
  assert.equal(embedded.themes.length, 3)
  assert.deepEqual(
    embedded.themes.map((theme) => [theme.id, theme.name, theme.variant, theme.colorScheme]),
    THEMES.map((theme) => [theme.id, theme.name, theme.variant, theme.colorScheme]),
  )

  for (const theme of embedded.themes) {
    assert.equal(Object.keys(theme.tokens).length, EXPECTED_TOKEN_COUNT,
      `embedded theme "${theme.id}" must contain ${EXPECTED_TOKEN_COUNT} tokens`)
    assert.deepEqual(theme.tokens, tokens(theme.variant), `embedded theme "${theme.id}" tokens must match src/tokens.js`)
  }
})

test('locale dictionaries carry the settings-row copy the bundle inlines', () => {
  const dicts = {}
  for (const id of ['en', 'zh']) {
    const document = JSON.parse(readFileSync(new URL(`${id}.json`, LOCALE_DIR), 'utf8'))
    assert.equal(typeof document.meta?.title, 'string', `locale/${id}.json meta.title must be a string`)
    assert.equal(typeof document.meta?.description, 'string', `locale/${id}.json meta.description must be a string`)
    assert.ok(document.rosePine && typeof document.rosePine === 'object', `locale/${id}.json needs a rosePine section`)
    assert.deepEqual(Object.keys(document.rosePine).sort(), [...ROW_STRING_KEYS].sort(),
      `locale/${id}.json rosePine keys must match the row contract`)
    for (const key of ROW_STRING_KEYS) {
      assert.ok(typeof document.rosePine[key] === 'string' && document.rosePine[key].length > 0,
        `locale/${id}.json rosePine.${key} must be a non-empty string`)
    }
    dicts[id] = document.rosePine
  }

  const source = readFileSync(CLIENT_PATH, 'utf8')
  const start = source.indexOf('const ROSE_PINE = ')
  const end = source.indexOf(';\n', start)
  const embedded = JSON.parse(source.slice(start + 'const ROSE_PINE = '.length, end))
  assert.deepEqual(embedded.strings, dicts, 'lib/client.js must inline locale/*.json rosePine dictionaries verbatim')
})

test('bundle manifest and icon are present and well formed', () => {
  const manifest = readFileSync(MANIFEST_PATH, 'utf8')
  assert.match(manifest, /^- insert:/m)
  assert.match(manifest, /^\s*-\s*id: rose-pine$/m)
  assert.match(manifest, /^\s+name: 'dsh-rose-pine'$/m)

  const icon = readFileSync(ICON_PATH, 'utf8')
  assert.ok(statSync(ICON_PATH).size < 8 * 1024, 'icon.svg must stay under 8 KiB')
  assert.match(icon, /^<svg\b/, 'icon.svg must start with an <svg> root element')
  assert.match(icon, /viewBox="0 0 64 64"/, 'icon.svg must use a 64×64 viewBox')
  assert.doesNotMatch(icon, /<script\b/i, 'icon.svg must not contain scripts')
  assert.doesNotMatch(icon, /(?:href|src)\s*=\s*"(?:https?:|\/\/)/i, 'icon.svg must not reference external resources')
  const lowered = icon.toLowerCase()
  for (const color of ['#191724', '#31748f', '#ebbcba']) {
    assert.ok(lowered.includes(color), `icon.svg should use the Rosé Pine palette color ${color}`)
  }
})
