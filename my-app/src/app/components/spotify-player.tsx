"use client"
import { memo, useEffect } from "react"
import { Play, Square } from "lucide-react"
import { useMusic } from "../contexts/music-context"

const SpotifyPlayer = memo(() => {
  const { isPlaying, currentSong, togglePlayPause, changeSong } = useMusic()

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

  return (
    <button
      onClick={togglePlayPause}
      className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-110 transition-transform flex-shrink-0"
      title={isPlaying ? "Stop music" : "Play music"}
      aria-label={isPlaying ? "Stop music" : "Play music"}
    >
      {isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
    </button>
  )
})

SpotifyPlayer.displayName = 'SpotifyPlayer'
export default SpotifyPlayer
