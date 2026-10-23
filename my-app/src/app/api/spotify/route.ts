import { NextResponse } from "next/server"
import { mostPlayedThisWeek, type SpotifyTrack } from "@/lib/spotify"

// The top track barely changes; cache it for an hour so visits don't hit Spotify's rate limits.
const CACHE_HEADER = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN must be set")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Spotify token request failed: ${response.status}`)
  return (await response.json()).access_token as string
}

async function spotifyGet(path: string, token: string) {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Spotify ${path} request failed: ${response.status}`)
  return response.json()
}

// Spotify stopped returning preview_url for newer apps, but the public embed page still carries it.
// shortcut: scrapes the embed page's JSON, revisit if Spotify changes that markup.
async function findPreviewUrl(trackId: string): Promise<string | null> {
  const response = await fetch(`https://open.spotify.com/embed/track/${trackId}`, { cache: "no-store" })
  if (!response.ok) return null
  return /"audioPreview":\{"url":"([^"]+)"/.exec(await response.text())?.[1] ?? null
}

export async function GET() {
  try {
    const token = await getAccessToken()
    // Spotify only keeps the last 50 plays; if none are from this week, use the ~4-week top track.
    const recent = await spotifyGet("/me/player/recently-played?limit=50", token)
    let track: SpotifyTrack | null = mostPlayedThisWeek(recent.items ?? [])
    let period = "this week"
    if (!track) {
      track = (await spotifyGet("/me/top/tracks?limit=1&time_range=short_term", token)).items?.[0] ?? null
      period = "this month"
    }
    if (!track) throw new Error("Spotify returned no tracks")

    return NextResponse.json(
      {
        title: track.name,
        artist: track.artists.map((artist: { name: string }) => artist.name).join(", "),
        albumArt: (track.album.images[1] ?? track.album.images[0])?.url ?? null,
        url: track.external_urls.spotify,
        period,
        previewUrl: track.preview_url ?? (await findPreviewUrl(track.id)),
      },
      { headers: { "Cache-Control": CACHE_HEADER } },
    )
  } catch (error) {
    console.error("Spotify API error:", error)
    return NextResponse.json({ error: "Failed to load top track" }, { status: 503 })
  }
}
