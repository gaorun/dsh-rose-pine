/**
 * dsh-rose-pine — Host half.
 *
 * There is nothing for the Host to do. This bundle exists to repaint the Web UI,
 * and all of that work happens in the browser half (lib/client.js): it registers
 * the three Rosé Pine variants with `ctx.theme` and stacks a token-override layer
 * that follows the existing Appearance light/dark preference.
 *
 * Keeping this module and its `apply` export means the bundle row activates, so
 * the package shows up in the Plugin Manager with its display metadata (name,
 * description, icon) instead of looking inert.
 *
 * @param {unknown} ctx Host context (unused).
 * @param {unknown} config Bundle config (unused).
 */
export function apply(ctx, config) {}
