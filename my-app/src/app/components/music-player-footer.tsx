"use client"
import { memo, useCallback, useState, useEffect } from "react"
import { Play, Pause, Music } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMusic } from "../contexts/music-context"

interface Song {
  path: string
  name: string
}

const MusicPlayerFooter = memo(() => {
  const {
    isPlaying,
    currentTime,
    duration,
    currentSong,
    togglePlayPause,
    seek,
    changeSong
  } = useMusic()

  const [showSongMenu, setShowSongMenu] = useState(false)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)

  // Fetch songs from API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoadingSongs(true)
        const response = await fetch('/api/songs')

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API error:', errorData)
          throw new Error(`Failed to fetch songs: ${errorData.error || response.statusText}`)
        }

        const songList: Song[] = await response.json()
        setSongs(songList)

        // Set the first song as default if available and no song is currently selected
        if (songList.length > 0 && currentSong === null) {
          console.log('Setting default song:', songList[0])
          changeSong(songList[0].path)
        }
      } catch (error) {
        console.error('Error loading songs:', error)
      } finally {
        setIsLoadingSongs(false)
      }
    }

    fetchSongs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTime = useCallback((time: number) => {
    if (isNaN(time) || time < 0) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Get current song name from the songs list
  const currentSongName = songs.find(song => song.path === currentSong)?.name || 'No song selected'

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-4 inset-x-0 mx-auto z-[9998] w-[95%] max-w-4xl"
    >
      <div className="w-full px-4 py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.15)"
        }}
      >
        <div className="flex items-center gap-3">
          {/* Song Selection Button */}
          <div className="relative"
            onMouseEnter={() => setShowSongMenu(true)}
            onMouseLeave={() => setShowSongMenu(false)}
          >
            <button
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              title="Select Song"
            >
              <Music size={18} />
            </button>

            {/* Song Selection Dropdown */}
            <AnimatePresence>
              {showSongMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-2 left-0 w-48 rounded-xl backdrop-blur-xl bg-slate-800/95 border border-white/20 shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  <div className="py-2">
                    {isLoadingSongs ? (
                      <div className="px-4 py-2 text-sm text-gray-400">Loading songs...</div>
                    ) : songs.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-400">No songs available</div>
                    ) : (
                      songs.map((song) => (
                        <button
                          key={song.path}
                          onClick={() => changeSong(song.path)}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                            currentSong === song.path
                              ? 'bg-blue-600/30 text-white border-l-2 border-blue-400'
                              : 'text-gray-300 hover:bg-white/10 border-l-2 border-transparent'
                          }`}
                        >
                          {song.name}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player Content */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
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

            {/* Time and Song Name */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-300 hidden sm:block">
                {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "--:--"}
              </span>
              <span className="text-sm text-blue-400 font-medium hidden md:block max-w-[150px] truncate">
                {currentSongName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

MusicPlayerFooter.displayName = 'MusicPlayerFooter'
export default MusicPlayerFooter
