// Run: npx tsx src/lib/utils.test.ts
import assert from "node:assert"
import { labelScale, shouldPlaceMarkers } from "./utils"

// ── labelScale ────────────────────────────────────────────────────────────────
// Teahouse labels are world-space <Text>, so a fixed fontSize shrinks to an
// unreadable smudge on far cups and balloons over the whole screen on the
// focused one. Scaling by camera distance keeps apparent size roughly constant.

// At the reference distance the label renders at its authored size.
assert.strictEqual(labelScale(6), 1, "reference distance should be 1x")

// Apparent size stays constant => scale grows with distance.
assert.ok(labelScale(9) > labelScale(6), "farther label must scale up")
assert.ok(labelScale(3) < labelScale(6), "nearer label must scale down")

// Clamped at both ends: a focused cup sits ~1 unit away (the giant-label bug)
// and the far wall cups sit ~12 away (the smudge bug).
assert.ok(labelScale(0.2) >= 0.55, "must not collapse when camera is on top of it")
assert.ok(labelScale(50) <= 2.4, "must not balloon at extreme distance")
assert.strictEqual(labelScale(1000), labelScale(50), "clamps to a flat max")

// Degenerate camera distances must not produce NaN/negative scales.
for (const d of [0, -1, NaN]) {
  const s = labelScale(d)
  assert.ok(Number.isFinite(s) && s > 0, `labelScale(${d}) must be finite and positive`)
}

// ── shouldPlaceMarkers ────────────────────────────────────────────────────────
// The globe bug: markers were gated behind mapbox's one-shot `load` event via a
// transient loaded() check, so a late /api/locations response subscribed to an
// event that had already fired and the pins never appeared until a refresh.
// Markers are DOM overlays and need no style/source load — the only real
// preconditions are "map exists" and "there is something to place".

assert.strictEqual(shouldPlaceMarkers(true, 3), true, "ready map + locations => place")

// Independent of tile/style state — this is the regression guard. If someone
// reintroduces a loaded()/load gate, placement stops being a pure function of
// these two inputs and this file is where it breaks.
assert.strictEqual(shouldPlaceMarkers(true, 1), true, "must not wait on style/tiles")

assert.strictEqual(shouldPlaceMarkers(false, 3), false, "no map yet => wait")
assert.strictEqual(shouldPlaceMarkers(true, 0), false, "no locations => nothing to place")

console.log("✓ utils tests passed")
