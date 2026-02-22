"use client"
import { memo, useCallback, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { useMusic } from "../contexts/music-context"
import ColorPicker from "./color-picker"

const Footer = memo(() => {
  const {
    isPlaying,
    currentTime,
    duration,
    currentSong,
    togglePlayPause,
    seek,
    changeSong
  } = useMusic()

  // Load the first song on mount
  useEffect(() => {
    const loadSong = async () => {
      try {
        const response = await fetch('/api/songs')
        if (!response.ok) return

        const songs = await response.json()
        if (songs.length > 0 && currentSong === null) {
          changeSong(songs[0].path)
        }
      } catch (error) {
        console.error('Error loading song:', error)
      }
    }

    loadSong()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTime = useCallback((time: number) => {
    if (isNaN(time) || time < 0) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto z-[9998] w-[95%] max-w-4xl">
      <div className="w-full px-4 py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.15)"
        }}
      >
        <div className="flex items-center gap-3">
          {/* Theme Color Picker */}
          <ColorPicker />

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors flex-shrink-0"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>

          {/* Progress Bar */}
          <div className="flex-1 relative min-w-0">
            <input
              type="range"
              value={currentTime}
              max={duration || 100}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-800/50 rounded-full appearance-none cursor-pointer slider relative z-10"
              style={{
                background: "linear-gradient(to right, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                outline: "none",
              }}
              aria-label="Music progress"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm pointer-events-none" />
          </div>

          {/* Time Display */}
          <span className="text-xs text-gray-300 hidden sm:block flex-shrink-0">
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "--:--"}
          </span>
        </div>
      </div>
    </div>
  )
})

Footer.displayName = 'Footer'
export default Footer
