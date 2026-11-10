# dsh-rose-pine

Rosé Pine for the DeepSeek Harness Web UI. The bundle registers the three official variants — Rosé Pine, Rosé Pine Moon and Rosé Pine Dawn — and paints the Harness theme tokens with their official palette, so backgrounds, text roles, borders, controls, tooltips, code blocks and diff highlights all follow the theme. It follows the existing Appearance light/dark/system preference instead of adding another entry to the built-in theme picker: a token override layer named `dsh-rose-pine` is re-applied on every page load and overlays the current scheme.

## The three variants

| Variant | Theme id | `colorScheme` | Used when |
|---|---|---|---|
| Rosé Pine | `rose-pine` | `dark` | Appearance is dark (the default dark variant) |
| Rosé Pine Moon | `rose-pine-moon` | `dark` | Appearance is dark after choosing Moon in Settings → General |
| Rosé Pine Dawn | `rose-pine-dawn` | `light` | Appearance is light |

## Palette

The 15 official color roles, as published by the Rosé Pine project and shipped in the `@rose-pine/palette` npm package:

| Role | Rosé Pine (main) | Rosé Pine Moon (moon) | Rosé Pine Dawn (dawn) |
|---|---|---|---|
| base | `#191724` | `#232136` | `#faf4ed` |
| surface | `#1f1d2e` | `#2a273f` | `#fffaf3` |
| overlay | `#26233a` | `#393552` | `#f2e9e1` |
| muted | `#6e6a86` | `#6e6a86` | `#9893a5` |
| subtle | `#908caa` | `#908caa` | `#797593` |
| text | `#e0def4` | `#e0def4` | `#575279` |
| love | `#eb6f92` | `#eb6f92` | `#b4637a` |
| gold | `#f6c177` | `#f6c177` | `#ea9d34` |
| rose | `#ebbcba` | `#ea9a97` | `#d7827e` |
| pine | `#31748f` | `#3e8fb0` | `#286983` |
| foam | `#9ccfd8` | `#9ccfd8` | `#56949f` |
| iris | `#c4a7e7` | `#c4a7e7` | `#907aa9` |
| highlightLow | `#21202e` | `#2a283e` | `#f4ede8` |
| highlightMed | `#403d52` | `#44415a` | `#dfdad9` |
| highlightHigh | `#524f67` | `#56526e` | `#cecacd` |

## How it maps onto Harness tokens

Harness themes are plain token maps: the client theme service applies each entry with `body.style.setProperty(name, value)`. This bundle registers the three variant definitions and stacks a `ctx.theme.overrideTokens` layer named `dsh-rose-pine` covering all 118 built-in tokens (`--dsw-alias-*` and `--dsw-specific-*`, catalogued in [docs/builtin-tokens.json](docs/builtin-tokens.json)). Every value is a fully resolved color derived from the variant's own palette, with alpha added where a translucent overlay is expected, so rendering never depends on a Harness stylesheet variable.

Mapping is grouped by UI concern:

- **Backgrounds and surfaces** — `bg-base` is `base`; layers 1–3 step up through `surface`, `overlay` and the highlight neutrals; sidebar, module platform, selector, tip and multi-select fills use `highlightLow` in the dark variants and `overlay` in Dawn; inputs, menus, bubbles and their highlights use `surface`/`overlay`/`highlightLow`/`highlightMed`.
- **Text and icons** — `label-primary` is `text`; secondary is `subtle`; tertiary, caption and dimmed labels are `muted`; foreground and brand text resolve to `base` so they stay readable on filled accents; `label-primary-bluish` uses `foam`.
- **Brand, links and states** — brand primary is `iris`; links and success secondary are `foam`; errors use `love` with `rose` as the softer secondary; warnings use `gold`; success primary is `pine`; done is `rose`; idle is `muted`.
- **Borders and separators** — `highlightMed`/`highlightHigh` at the built-in alpha weights, using `rgba()` of the border role for translucent hairlines and solid roles where the design calls for a stronger line, kept structurally analogous between light and dark.
- **Interactive surfaces and controls** — hover, active and selected states use text-color alpha washes (`rgba(text, …)`) or the highlight neutrals; button fills, the switch thumb, tooltips and toasts pair accent or solid fills with the palette's contrasting text role.
- **Code, markdown and diffs** — code blocks use `surface` (dark) and `highlightLow` (Dawn), with banners, tabs and inline code a step apart so blocks stay visible against the page; citations, placeholders and tags use the layer and highlight roles; added and deleted diff tints are `pine` and `love` at low alpha.
- **Illustration and scrims** — illustration surfaces use `surface`, `highlightLow` and `highlightMed`; masks, skeleton, tool-bar and shimmer tokens intentionally keep neutral black/white alphas because they are scrims over content, not theme colors.

Text roles are chosen so primary text keeps at least 4.5:1 contrast on the base, layer-1, sidebar and bubble backgrounds, and secondary/tertiary text keeps at least 3:1 on the base; the test suite checks these thresholds.

## Install

The bundle installs into a DeepSeek Harness profile from this package directory — nothing is published to npm. Use either route.

### Plugin Manager

1. Open Plugin Manager in the Harness Web UI.
2. Choose the install-bundle action and select this directory, the folder that contains [package.json](package.json).
3. Confirm the installation. The bundle appears in Plugin Manager and its browser half (`lib/client.js`) loads in the Web UI.

### `plugin_manager` tool

From an agent session in the same profile, call `plugin_manager` with:

- `action`: `install_bundle`
- `target`: the absolute path of this directory, for example `/Users/run/my-repos/dsh-rose-pine`

Installation affects every session in the active profile and persists across restarts. A local directory install links this checkout, so rebuild `lib/client.js` (`npm run build`) after editing sources, and restart the Harness if an updated copy does not take effect. A new bundle can activate without a restart.

## Appearance and variants

The bundle follows Appearance (`light`, `dark` or `system`) and does not add a selectable theme to the built-in picker:

- **Light** → Rosé Pine Dawn.
- **Dark** → Rosé Pine by default. The **Rosé Pine** row in **Settings → General** switches the dark variant to **Rosé Pine Moon**; the choice is remembered in the browser.
- **System** → whichever scheme the operating system reports.

The row states both halves up front — `Light appearance: Rosé Pine Dawn · Dark appearance: Rosé Pine` — because the
buttons only choose the dark variant. Switching to Rosé Pine Moon while the window is in light mode changes the
"dark appearance" value immediately but does not repaint anything until Appearance goes dark; in dark mode the same
click repaints at once. Each button previews its variant (base, surface, text and the variant's `rose` accent).

The Harness Appearance preference is a closed `light | dark | system` enum, so a third-party theme cannot be selected or persisted through the built-in Appearance row. The Rosé Pine definitions are still registered with the theme service for consumers that read theme definitions, and the override layer repaints the UI for the active scheme.

## Development

Node.js `^22.19.0` or `>=24.0.0` is required (see `engines` in [package.json](package.json)).

```sh
npm install     # installs the @rose-pine/palette devDependency
npm run build   # regenerates lib/client.js from src/client.template.js and src/tokens.js
npm test        # palette, token-coverage, contrast and build-output checks
```

`npm run build` is the only code-generation step: `src/tokens.js` maps each variant's palette onto the 118 tokens, and `scripts/build.mjs` inlines the three token maps plus the `rosePine` dictionaries from `locale/*.json` into the browser module. Do not edit `lib/client.js` directly.

## Project layout

```text
dsh-rose-pine/
├── package.json              bundle manifest (dsh.bundle.patch, dsh.client)
├── cordis.patch.yml          inserts the rose-pine row into the Harness composition
├── index.js                  host half: no host-side work, keeps the bundle row active
├── icon.svg                  plugin icon
├── src/
│   ├── client.template.js    browser half template (module-loader factory, token override + settings row)
│   └── tokens.js             palette → 118 Harness theme tokens, per variant
├── scripts/build.mjs         inlines the theme data into lib/client.js
├── lib/client.js             generated browser bundle (do not edit)
├── test/theme.test.mjs       palette, coverage, contrast and build-output tests
├── locale/en.json            display metadata + settings-row copy (English)
├── locale/zh.json            display metadata + settings-row copy (Simplified Chinese)
├── docs/builtin-tokens.json  the 118 built-in tokens this theme overrides
├── SPEC.md                   implementation spec for this repository
├── README.md
└── LICENSE
```

## Credits

- [Rosé Pine](https://rosepinetheme.com) by mvllow and contributors — the palette, the variant designs and their names.
- [Rosé Pine palette reference](https://rosepinetheme.com/en/palette/) — the 15 official color roles used here.
- [Rosé Pine theme-creation guide](https://rosepinetheme.com/en/create/create-a-theme/) — the theme specification this plugin follows.
- [`@rose-pine/palette`](https://www.npmjs.com/package/@rose-pine/palette) — the npm package the colors are read from (MIT, © mvllow).

## License

MIT — see [LICENSE](LICENSE). The Rosé Pine palette is by the Rosé Pine community and is used through the MIT-licensed `@rose-pine/palette` package; [LICENSE](LICENSE) also carries the palette notice.
