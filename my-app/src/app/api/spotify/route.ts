import { NextResponse } from "next/server"
import { parseEmbedPreviewUrl } from "@/lib/spotify"

// Top songs shift slowly; cache for an hour so visits don't hit Spotify's rate limits.
const CACHE_HEADER = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"

type SpotifyTrack = {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  external_urls: { spotify: string }
  preview_url?: string | null
}

// Your own top songs need your login, so the stored refresh token is swapped for a short-lived access token.
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

async function findPreviewUrl(trackId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://open.spotify.com/embed/track/${trackId}`, { cache: "no-store" })
    return response.ok ? parseEmbedPreviewUrl(await response.text()) : null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const token = await getAccessToken()
    // short_term = Spotify's own ranking of the last ~4 weeks
    const response = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!response.ok) throw new Error(`Spotify top tracks request failed: ${response.status}`)
    const top: SpotifyTrack[] = (await response.json()).items ?? []

    const tracks = await Promise.all(
      top.map(async (track, i) => ({
        id: track.id,
        rank: i + 1,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        albumArt: (track.album.images[1] ?? track.album.images[0])?.url ?? null,
        url: track.external_urls.spotify,
        previewUrl: track.preview_url ?? (await findPreviewUrl(track.id)),
      })),
    )
    // A song with no preview can't play here, so it's left out (its rank number stays honest).
    const playable = tracks.filter((track) => track.previewUrl)
    if (playable.length === 0) throw new Error("No playable top songs")

    return NextResponse.json({ tracks: playable }, { headers: { "Cache-Control": CACHE_HEADER } })
  } catch (error) {
    console.error("Spotify API error:", error)
    return NextResponse.json({ error: "Failed to load top songs" }, { status: 503 })
  }
}
