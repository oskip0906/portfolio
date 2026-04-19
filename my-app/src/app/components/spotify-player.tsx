"use client"
import { memo, useEffect } from "react"
import { Play, Square } from "lucide-react"
import { useMusic } from "../contexts/music-context"
import { cn } from "@/lib/utils"
import { useBackground } from "../contexts/background-context"

const SpotifyPlayer = memo(({
  variant = "nav",
}: {
  variant?: "nav" | "hud"
}) => {
  const { isPlaying, currentSong, togglePlayPause, changeSong } = useMusic()
  const { roomTheme } = useBackground()
  const isHud = variant === "hud"

  useEffect(() => {
    if (currentSong === null) {
      changeSong('/api/audio')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button
      onClick={togglePlayPause}
      className={cn(
        "text-white transition-transform hover:scale-110 flex-shrink-0",
        isHud
          ? "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
      )}
      style={isHud ? {
        boxShadow: `0 18px 40px ${roomTheme.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`,
      } : undefined}
      title={isPlaying ? "Stop music" : "Play music"}
      aria-label={isPlaying ? "Stop music" : "Play music"}
    >
      {isPlaying ? (
        <Square size={16} fill="currentColor" style={isHud ? { color: roomTheme.uiAccent } : undefined} />
      ) : (
        <Play size={16} className="ml-0.5" fill="currentColor" style={isHud ? { color: roomTheme.uiAccent } : undefined} />
      )}
    </button>
  )
})

SpotifyPlayer.displayName = 'SpotifyPlayer'
export default SpotifyPlayer
