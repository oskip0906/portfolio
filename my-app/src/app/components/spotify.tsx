"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Loader2, Shuffle } from "lucide-react"

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
      className="w-full max-w-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      {/* Player Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
          <div className="flex flex-col items-center justify-center">
            {currentPlayingTrack ? (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
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
                <div className="mt-2 text-center pt-2">
                  <p className="text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis" title={`${currentPlayingTrack.name} - ${currentPlayingTrack.artist} - ${currentPlayingTrack.album}`}>
                    <span className="font-semibold">{currentPlayingTrack.name}</span> - <span className="text-slate-300">{currentPlayingTrack.artist}</span> - <span className="text-slate-400">{currentPlayingTrack.album}</span>
                  </p>
                  <div className="mt-2 flex justify-center gap-4 text-xs text-slate-400">
                    <span>Popularity: {currentPlayingTrack.popularity}/100</span>
                    <span>Released: {currentPlayingTrack.releaseDate}</span>
                  </div>
                  
                  {/* Button below song info */}
                  <div className="mt-4">
                    <button
                      onClick={fetchRandomSong}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/70 hover:to-purple-400/70 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Looking through Oscar's playlist...
                        </>
                      ) : (
                        <>
                          <Shuffle className="w-4 h-4" />
                          Suggest Random Song
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-300 text-sm mb-4">{message}</p>
                
                {/* Button for initial state */}
                <button
                  onClick={fetchRandomSong}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/70 hover:to-purple-400/70 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Looking through Oscar's playlist...
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-4 h-4" />
                      Suggest Random Song
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