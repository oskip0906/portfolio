"use client"
import { memo, useEffect, useState } from "react"
import { Pause, Play } from "lucide-react"
import { FaSpotify } from "react-icons/fa"
import { useMusic } from "../contexts/music-context"
import { cn } from "@/lib/utils"
import { useBackground } from "../contexts/background-context"

type TopTrack = {
  title: string
  artist: string
  albumArt: string | null
  url: string
  period: string
  previewUrl: string | null
}

const SpotifyPlayer = memo(() => {
  const { isPlaying, currentSong, togglePlayPause, changeSong } = useMusic()
  const { roomTheme } = useBackground()
  const [track, setTrack] = useState<TopTrack | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/spotify")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((data: TopTrack | null) => {
        if (cancelled) return
        const playable = data?.previewUrl ? data : null
        setTrack(playable)
        // No playable Spotify preview → keep the site's bundled song.
        if (currentSong === null) changeSong(playable?.previewUrl ?? "/api/audio")
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const label = isPlaying ? "Pause music" : "Play music"
  const shell = "flex h-12 items-center rounded-full border border-white/10 bg-black/80 backdrop-blur-xl"
  const shadow = { boxShadow: `0 18px 40px ${roomTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.12)` }

  if (!track) {
    const Icon = isPlaying ? Pause : Play
    return (
      <button
        onClick={togglePlayPause}
        disabled={currentSong === null}
        className={cn(shell, "w-12 flex-shrink-0 justify-center text-white transition-transform hover:scale-105")}
        style={shadow}
        title={label}
        aria-label={label}
      >
        <Icon size={18} fill="currentColor" style={{ color: roomTheme.uiAccent }} />
      </button>
    )
  }

  return (
    <div className={cn(shell, "min-w-0 gap-2.5 py-1 pl-1 pr-4")} style={shadow}>
      <button
        onClick={togglePlayPause}
        className="group relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/15"
        title={label}
        aria-label={label}
      >
        {track.albumArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArt}
            alt=""
            className={cn("h-full w-full object-cover", isPlaying && "animate-[spin_9s_linear_infinite]")}
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-colors group-hover:bg-black/55">
          {isPlaying ? (
            <>
              <span className="flex h-3.5 items-end gap-[2px] group-hover:hidden" aria-hidden="true">
                {[0, 0.25, 0.5].map((delay) => (
                  <span
                    key={delay}
                    className="h-full w-[3px] origin-bottom animate-[equalizer_0.9s_ease-in-out_infinite] rounded-full bg-white"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </span>
              <Pause size={15} fill="currentColor" className="hidden group-hover:block" />
            </>
          ) : (
            <Play size={15} fill="currentColor" className="ml-0.5" />
          )}
        </span>
      </button>

      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 max-w-[11rem] leading-tight"
        title={`${track.title} · ${track.artist} — open in Spotify`}
      >
        <span className="block truncate text-[13px] font-semibold text-white">{track.title}</span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[11px] text-white/55">
          <FaSpotify className="flex-shrink-0 text-[#1DB954]" aria-hidden="true" />
          <span className="truncate">Most played {track.period} · {track.artist}</span>
        </span>
      </a>
    </div>
  )
})

SpotifyPlayer.displayName = "SpotifyPlayer"
export default SpotifyPlayer
