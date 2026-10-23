"use client"
import { memo, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, ChevronDown, Pause, Play } from "lucide-react"
import { FaSpotify } from "react-icons/fa"
import { useMusic } from "../contexts/music-context"
import { cn } from "@/lib/utils"
import { useBackground } from "../contexts/background-context"
import { useHoverMenu } from "./use-hover-menu"

type Track = {
  id: string
  rank: number
  title: string
  artist: string
  albumArt: string | null
  url: string
  previewUrl: string
}

function Equalizer() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden="true">
      {[0, 0.25, 0.5].map((delay) => (
        <span
          key={delay}
          className="h-full w-[3px] origin-bottom animate-[equalizer_0.9s_ease-in-out_infinite] rounded-full bg-current"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  )
}

const SpotifyPlayer = memo(() => {
  const { isPlaying, currentSong, togglePlayPause, changeSong, audioRef } = useMusic()
  const { roomTheme } = useBackground()
  const [tracks, setTracks] = useState<Track[]>([])
  // Only the outside-tap close is used: a song list opens on click, not on hover.
  const { open, setOpen, hoverProps } = useHoverMenu()

  useEffect(() => {
    let cancelled = false
    fetch("/api/spotify")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((data: { tracks?: Track[] } | null) => {
        if (cancelled || !data?.tracks?.length) return // no top songs → no player
        setTracks(data.tracks)
        if (currentSong === null) changeSong(data.tracks[0].previewUrl)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentIndex = Math.max(0, tracks.findIndex((track) => track.previewUrl === currentSong))
  const current = tracks[currentIndex]

  // Previews are 30-second clips, so roll on to the next song when one ends.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || tracks.length === 0) return
    const playNext = () => changeSong(tracks[(currentIndex + 1) % tracks.length].previewUrl, true)
    audio.addEventListener("ended", playNext)
    return () => audio.removeEventListener("ended", playNext)
  }, [audioRef, tracks, currentIndex, changeSong])

  if (!current) return null

  const label = isPlaying ? "Pause music" : "Play music"

  return (
    // Not `relative`: the song list anchors to the HUD row so it can use the full width on phones.
    <div ref={hoverProps.ref} className="flex min-w-0">
      <div
        className="flex h-12 min-w-0 items-center gap-2.5 rounded-full border border-white/10 bg-black/80 py-1 pl-1 pr-3 backdrop-blur-xl"
        style={{ boxShadow: `0 18px 40px ${roomTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.12)` }}
      >
        <button
          onClick={togglePlayPause}
          className="group relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/15"
          title={label}
          aria-label={label}
        >
          {current.albumArt && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.albumArt}
              alt=""
              className={cn("h-full w-full object-cover", isPlaying && "animate-[spin_9s_linear_infinite]")}
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-colors group-hover:bg-black/55">
            {isPlaying ? (
              <>
                <span className="group-hover:hidden"><Equalizer /></span>
                <Pause size={15} fill="currentColor" className="hidden group-hover:block" />
              </>
            ) : (
              <Play size={15} fill="currentColor" className="ml-0.5" />
            )}
          </span>
        </button>

        <button
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          title="Choose a song"
          className="flex min-w-0 items-center gap-2 text-left"
        >
          <span className="min-w-0 max-w-[11rem] leading-tight">
            <span className="block truncate text-[13px] font-semibold text-white">{current.title}</span>
            <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[11px] text-white/55">
              <FaSpotify className="flex-shrink-0 text-[#1DB954]" aria-hidden="true" />
              <span className="truncate">#{current.rank} this month · {current.artist}</span>
            </span>
          </span>
          <ChevronDown
            size={15}
            className={cn("flex-shrink-0 text-white/50 transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-[10000] w-[min(20rem,calc(100vw-2rem))] origin-top-right pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/90 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <FaSpotify size={20} className="flex-shrink-0 text-[#1DB954]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">Most played this month</p>
                  <p className="text-[11px] text-white/45">My top {tracks.length} on Spotify · 30-second previews</p>
                </div>
              </div>

              <ul
                role="listbox"
                aria-label="Most played this month"
                className="max-h-[min(22rem,calc(100dvh-12rem))] overflow-y-auto p-1.5"
              >
                {tracks.map((track, i) => {
                  const active = i === currentIndex
                  return (
                    <li key={track.id}>
                      <button
                        role="option"
                        aria-selected={active}
                        onClick={() => (active ? togglePlayPause() : changeSong(track.previewUrl, true))}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-white/[0.08]",
                          active && "bg-white/[0.08]",
                        )}
                      >
                        <span
                          className="w-4 flex-shrink-0 text-center font-mono text-[11px] tabular-nums"
                          style={{ color: active ? roomTheme.uiAccent : "rgba(255,255,255,0.35)" }}
                        >
                          {track.rank}
                        </span>
                        <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
                          {track.albumArt && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={track.albumArt} alt="" loading="lazy" className="h-full w-full object-cover" />
                          )}
                          <span
                            className={cn(
                              "absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100",
                              active && "opacity-100",
                            )}
                          >
                            {active && isPlaying ? <Equalizer /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className="block truncate text-[13px] font-medium"
                            style={{ color: active ? roomTheme.uiAccent : "rgba(255,255,255,0.9)" }}
                          >
                            {track.title}
                          </span>
                          <span className="block truncate text-[11px] text-white/45">{track.artist}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 border-t border-white/10 px-4 py-2.5 text-[11px] font-medium text-white/55 transition-colors hover:text-white"
              >
                Play the full song on Spotify <ArrowUpRight size={12} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

SpotifyPlayer.displayName = "SpotifyPlayer"
export default SpotifyPlayer
