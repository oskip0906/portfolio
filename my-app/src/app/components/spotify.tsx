"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Loader2, Shuffle } from "lucide-react"

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  embedUrl: string
  popularity: number
  releaseDate: string
}

export default function SpotifyPlayer() {
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<SpotifyTrack | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>("Click to get a random song recommendation from my playlist!")

  const fetchRandomSong = useCallback(async () => {
    setIsLoading(true)
    setMessage(null)
    setCurrentPlayingTrack(null)

    try {
      const response = await fetch('/api/spotify')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to fetch random song: ${response.statusText}`)
      }
      const track = await response.json()
      setCurrentPlayingTrack(track)
    } catch (error: any) {
      console.error("Failed to fetch random song:", error)
      setMessage(error.message || "Failed to fetch a random song. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center gap-4 min-h-[20vh]"
      initial={{ opacity: 0 } as any}
      animate={{ opacity: 1 } as any}
      transition={{ duration: 0.4 }}
    >
      {currentPlayingTrack ? (
        <motion.div
          className="w-full flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 8 } as any}
          animate={{ opacity: 1, y: 0 } as any}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Spotify embed */}
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              key={currentPlayingTrack.id}
              src={currentPlayingTrack.embedUrl}
              width="100%"
              height="80"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
              className="w-full block"
            />
          </div>

          {/* Song meta + shuffle button */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-4 text-xs text-slate-400">
              <span>Popularity: {currentPlayingTrack.popularity}/100</span>
              <span>Released: {currentPlayingTrack.releaseDate}</span>
            </div>
            <button
              onClick={fetchRandomSong}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/70 hover:to-purple-400/70 text-white text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking...</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4" />
                  <span>Suggest Random Song</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <p className="text-slate-300 text-sm">{message}</p>
          <button
            onClick={fetchRandomSong}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/70 hover:to-purple-400/70 text-white text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Looking through my playlist...</span>
              </>
            ) : (
              <>
                <Shuffle className="w-4 h-4" />
                <span>Suggest Random Song</span>
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}