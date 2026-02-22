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
      const response = await fetch('/api/spotify');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch random song: ${response.statusText}`);
      }
      const track = await response.json();
      setCurrentPlayingTrack(track);
    } catch (error: any) {
      console.error("Failed to fetch random song:", error)
      setMessage(error.message || "Failed to fetch a random song. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <motion.div
      className="w-full h-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-1.5"
      initial={{ opacity: 0 } as any}
      animate={{ opacity: 1 } as any}
      transition={{ duration: 0.4 }}
    >

      {/* Player Section */}
      <motion.div
        initial={{ opacity: 0 } as any}
        animate={{ opacity: 1 } as any}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
          <div className="flex flex-col items-center justify-center min-h-[170px]">
            {currentPlayingTrack ? (
              <motion.div
                className="w-full min-h-[170px] flex flex-col justify-between"
                initial={{ opacity: 0, y: 8 } as any}
                animate={{ opacity: 1, y: 0 } as any}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
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

                {/* Display Song Information */}
                <div className="text-center">
                  <div className="flex justify-center gap-4 text-xs text-slate-400">
                    <span>Popularity: {currentPlayingTrack.popularity}/100</span>
                    <span>Released: {currentPlayingTrack.releaseDate}</span>
                  </div>
                
                  {/* Button below song info */}
                  <div className="mt-2 mb-1">
                    <button
                      onClick={fetchRandomSong}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/70 hover:to-purple-400/70 text-white text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto"
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
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-2 min-h-[170px] flex flex-col justify-center">
                <p className="text-slate-300 text-sm mb-2">{message}</p>

                {/* Button for initial state */}
                <button
                  onClick={fetchRandomSong}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/70 hover:to-purple-400/70 text-white text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto"
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
          </div>
        </motion.div>
    </motion.div>
  )
}