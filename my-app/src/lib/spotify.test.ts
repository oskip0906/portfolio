// Run: npx tsx src/lib/spotify.test.ts
import assert from "node:assert"
import { parseEmbedPreviewUrl } from "./spotify"

const url = "https://p.scdn.co/mp3-preview/abc?cid=1&x=2"

// Finds the preview whichever order the fields come in…
assert.strictEqual(parseEmbedPreviewUrl(`{"audioPreview":{"url":"${url}","format":"MP3_96"}}`), url)
// …and undoes JSON escapes like & that Next.js puts in embedded page data.
assert.strictEqual(
  parseEmbedPreviewUrl(`{"audioPreview":{"format":"MP3_96","url":"https://p.scdn.co/mp3-preview/abc?cid=1\\u0026x=2"}}`),
  url,
)
// No preview on the page → null, so that song is left out instead of breaking the player.
assert.strictEqual(parseEmbedPreviewUrl("<html></html>"), null)

console.log("spotify tests passed")
