export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  external_urls: { spotify: string }
  preview_url: string | null
}

export interface RecentPlay {
  track: SpotifyTrack
  played_at: string
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// Spotify has no weekly top-tracks range, so count plays from the last 7 days in the
// recently-played history (newest first). On a tie the more recently played track wins.
export function mostPlayedThisWeek(plays: RecentPlay[], now = Date.now()): SpotifyTrack | null {
  const counts = new Map<string, { track: SpotifyTrack; count: number }>()
  for (const { track, played_at } of plays) {
    if (now - Date.parse(played_at) > WEEK_MS) continue
    const entry = counts.get(track.id) ?? { track, count: 0 }
    entry.count++
    counts.set(track.id, entry)
  }
  // Array sort is stable, so equal counts keep the newest-first insertion order.
  return [...counts.values()].sort((a, b) => b.count - a.count)[0]?.track ?? null
}
