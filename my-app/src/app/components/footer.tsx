"use client"
import { memo, useCallback, useEffect, useState } from "react"
import { Play, Pause } from "lucide-react"
import { useMusic } from "../contexts/music-context"
import { useBackground } from "../contexts/background-context"
import ColorPicker from "./color-picker"

function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

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
  const { baseColor } = useBackground()

  const [isVisible, setIsVisible] = useState(true)

  const lineGradient = (() => {
    const { h, s } = hexToHsl(baseColor)
    const c1 = `hsl(${(h - 30 + 360) % 360}, ${Math.min(s + 20, 100)}%, 65%)`
    const c2 = `hsl(${h}, ${Math.min(s + 10, 100)}%, 55%)`
    const c3 = `hsl(${(h + 30) % 360}, ${Math.min(s + 20, 100)}%, 65%)`
    return `linear-gradient(to right, ${c1}, ${c2}, ${c3})`
  })()

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
    <div className="fixed bottom-0 inset-x-0 mx-auto z-[9998] w-[95%] max-w-4xl flex flex-col items-center">
      {/* Player bar */}
      <div
        className="w-full transition-all duration-300 ease-in-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(110%)",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          marginBottom: "6px",
        }}
      >
        <div
          className="w-full px-4 py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl"
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

      {/* Toggle line — full width of the footer, sits at the very bottom */}
      <button
        onClick={() => setIsVisible((v) => !v)}
        className="w-full group flex flex-col items-center gap-0.5 mb-1.5"
        aria-label={isVisible ? "Hide player" : "Show player"}
      >
        <div
          className="w-full h-1.5 rounded-full transition-all duration-300"
          style={{
            background: lineGradient,
            opacity: 0.5,
          }}
        />
      </button>
    </div>
  )
})

Footer.displayName = 'Footer'
export default Footer
