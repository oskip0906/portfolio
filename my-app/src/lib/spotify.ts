// Spotify's Web API stopped returning preview_url for newer apps, but a track's public embed page
// still carries its 30-second preview, so read it from there.
// shortcut: depends on the embed page's "audioPreview" JSON, revisit if Spotify changes that markup.
export function parseEmbedPreviewUrl(html: string): string | null {
  const quoted = /"audioPreview":\{[^{}]*?"url":("(?:[^"\\]|\\.)*")/.exec(html)?.[1]
  return quoted ? JSON.parse(quoted) : null
}
