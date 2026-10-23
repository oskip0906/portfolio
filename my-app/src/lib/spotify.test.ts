// Run: npx tsx src/lib/spotify.test.ts
import assert from "node:assert"
import { mostPlayedThisWeek, type RecentPlay, type SpotifyTrack } from "./spotify"

const now = Date.parse("2026-10-23T12:00:00Z")
const track = (id: string) => ({ id, name: id }) as SpotifyTrack
const play = (id: string, daysAgo: number): RecentPlay => ({
  track: track(id),
  played_at: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
})

// The track played most often this week wins.
assert.strictEqual(mostPlayedThisWeek([play("a", 0), play("b", 1), play("b", 2), play("a", 3), play("b", 4)], now)?.id, "b")

// Plays older than 7 days don't count, even if they'd change the winner.
assert.strictEqual(mostPlayedThisWeek([play("a", 1), play("b", 8), play("b", 9)], now)?.id, "a")

// Ties go to the most recently played track (history is newest first).
assert.strictEqual(mostPlayedThisWeek([play("a", 0), play("b", 1), play("b", 2), play("a", 3)], now)?.id, "a")

// Nothing played this week → null, so the caller can fall back.
assert.strictEqual(mostPlayedThisWeek([play("a", 10)], now), null)
assert.strictEqual(mostPlayedThisWeek([], now), null)

console.log("spotify tests passed")
